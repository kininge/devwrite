/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prisma from "../utils/prisma";
import {
	BadRequestError,
	UnauthorizedError,
	ConflictError,
	NotFoundError,
} from "../utils/customErrors";
import logger from "../utils/logger";
import { CONSTANTS } from "../utils/constants";
import { generateTokens } from "../utils/generateTokens";
import { setAuthCookies } from "../utils/setAuthCookies";
import { createHash } from "crypto";
import { getRefreshToken } from "../utils/getFreshToken";
import { verifyRefreshToken } from "../utils/jwt";
import { UserRequest } from "../types/models";
import jwt from "jsonwebtoken";
import { validateDevice } from "../utils/validations";

export const signup = async (request: Request, response: Response) => {
	const { email, password, name, image } = request.body;
	// from request headers
	const deviceId = request.get("X-Device-ID");
	const deviceInfo = request.get("User-Agent");
	const ipAddress = request.ip;

	// validate input
	if (!email || !password)
		throw new BadRequestError(CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD);
	if (!deviceId)
		throw new BadRequestError(CONSTANTS.ERRORS.MISSING_DEVICE_ID);

	// check if user already exists
	const existingUser = await prisma.user.findUnique({
		where: { email },
	});
	logger.info(
		{
			email,
			existingUser,
		},
		CONSTANTS.EXISTING_USER_CHECKED
	);
	if (existingUser !== null)
		throw new ConflictError(CONSTANTS.ERRORS.USER_ALREADY_EXIST);

	// hash the password and create a new user
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser: User = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
			image,
		},
	});
	logger.info(
		{
			userId: newUser.id,
			email: newUser.email,
			name: newUser.name || "---",
			image: newUser.image || "---",
		},
		CONSTANTS.NEW_USER_GENERATED(newUser.email)
	);

	const { accessToken, refreshToken } = await generateTokens(
		newUser.id,
		newUser.email,
		newUser.name || "---",
		deviceId,
		deviceInfo,
		ipAddress
	);
	logger.info(
		{
			userId: newUser.id,
		},
		CONSTANTS.NEW_TOKEN_GENERATED(newUser.email)
	);

	return setAuthCookies(response, accessToken, refreshToken)
		.status(201)
		.json({
			id: newUser.id,
		});
};

export const login = async (request: Request, response: Response) => {
	const { email, password } = request.body;
	// from request headers
	const deviceId = request.get("X-Device-ID");
	const deviceInfo = request.get("User-Agent");
	const ipAddress = request.ip;

	// validate input
	if (!email || !password)
		throw new BadRequestError(CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD);
	if (!deviceId)
		throw new BadRequestError(CONSTANTS.ERRORS.MISSING_DEVICE_ID);

	// check if user exists and password is correct
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) throw new NotFoundError(CONSTANTS.USER_NOT_FOUND(email));
	else
		logger.info(
			{
				email,
				user,
			},
			CONSTANTS.EXISTING_USER_CHECKED
		);

	// password is hashed, so we need to compare it
	const isPasswordValid = await bcrypt.compare(password, user.password ?? "");
	if (!isPasswordValid) {
		new BadRequestError(CONSTANTS.PASSWORD_NOT_MATCHED(email));
		return response
			.status(401)
			.json({ error: CONSTANTS.ERRORS.INVALID_CREDENTIALS });
	} else logger.info(CONSTANTS.PASSWORD_VALIDATED);

	// mark existing refresh tokens as revoked --- soft delete
	const deviceIdHash = createHash("sha256").update(deviceId).digest("hex");
	const updated = await prisma.refreshToken.updateMany({
		where: { userId: user.id, deviceIdHash, isRevoked: false },
		data: { isRevoked: true }, // set isRevoked to true
	});
	logger.info(
		{
			userId: user.id,
			deviceId: deviceIdHash,
		},
		CONSTANTS.TOKEN_MARKED_EXPIRED(updated.count)
	);

	// generate access and refresh tokens
	const { accessToken, refreshToken } = await generateTokens(
		user.id,
		user.email,
		user.name || "---",
		deviceId,
		deviceInfo,
		ipAddress
	);
	logger.info(
		{
			userId: user.id,
			email: user.email,
			name: user.name || "---",
			image: user.image || "---",
		},
		CONSTANTS.NEW_TOKEN_GENERATED(user.email)
	);
	return setAuthCookies(response, accessToken, refreshToken)
		.status(200)
		.json({
			id: user.id,
		});
};

export const refreshToken = async (request: Request, response: Response) => {
	// from request headers
	const deviceId = request.get("X-Device-ID");
	const deviceInfo = request.get("User-Agent");
	const ipAddress = request.ip;
	// validate device id
	validateDevice(deviceId);
	const deviceIdHash = createHash("sha256").update(deviceId!).digest("hex");

	const currentRefreshToken = getRefreshToken(request);
	const currentAccessToken = request.cookies[CONSTANTS.ACCESS_TOKEN];
	if (!currentRefreshToken || !currentAccessToken)
		throw new BadRequestError(CONSTANTS.ERRORS.MISSING_REFRESH_TOKEN);

	// verify the refresh token
	const refreshTokenPayload = verifyRefreshToken(currentRefreshToken);
	if (!refreshTokenPayload || !refreshTokenPayload.refreshTokenId)
		throw new UnauthorizedError(CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN);

	// unfold access token payload
	const accessTokenPayload = jwt.decode(currentAccessToken) as any;

	// check old refresh token
	const refreshTokenRecord = await prisma.refreshToken.findUnique({
		where: { id: refreshTokenPayload.refreshTokenId, isRevoked: false },
	});
	logger.info(
		{
			refreshTokenRecord,
		},
		CONSTANTS.REFRESH_TOKEN
	);
	if (!refreshTokenRecord) {
		// token not found so ---> revoke all tokens for this device
		const updated = await prisma.refreshToken.updateMany({
			where: {
				userId: accessTokenPayload.userId,
				deviceIdHash: deviceIdHash,
			},
			data: { isRevoked: true },
		});

		throw new UnauthorizedError(CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN);
	}

	const userId = refreshTokenPayload.userId;
	const email = accessTokenPayload.email;
	const name = accessTokenPayload.name;
	const image = accessTokenPayload.image || "---";

	// soft delete the old refresh token
	const updated = await prisma.refreshToken.update({
		where: { id: refreshTokenPayload.refreshTokenId },
		data: { isRevoked: true },
	});
	logger.info(
		{
			id: refreshTokenPayload.refreshTokenId,
		},
		CONSTANTS.TOKEN_MARKED_EXPIRED(1)
	);

	// generate access and refresh tokens
	const { accessToken, refreshToken } = await generateTokens(
		userId,
		email,
		name,
		deviceIdHash,
		deviceInfo,
		ipAddress
	);
	logger.info({
		message: CONSTANTS.NEW_TOKEN_GENERATED(accessTokenPayload.email),
		userId,
		email,
		name,
		image,
	});
	return setAuthCookies(response, accessToken, refreshToken)
		.status(200)
		.json({
			id: accessTokenPayload.userId,
		});
};

export const logoutCurrent = async (request: Request, response: Response) => {
	// check refresh token exist
	const refreshToken = getRefreshToken(request);
	if (!refreshToken)
		throw new BadRequestError(CONSTANTS.ERRORS.MISSING_REFRESH_TOKEN);

	// verify the refresh token
	const refreshTokenPayload = verifyRefreshToken(refreshToken);
	if (!refreshTokenPayload || !refreshTokenPayload.refreshTokenId)
		throw new UnauthorizedError(CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN);

	// soft delete request toke
	const updated = await prisma.refreshToken.update({
		where: { id: refreshTokenPayload.refreshTokenId },
		data: { isRevoked: true },
	});
	logger.info(
		{
			id: refreshTokenPayload.refreshTokenId,
		},
		CONSTANTS.TOKEN_MARKED_EXPIRED(1)
	);

	response.clearCookie(CONSTANTS.REFRESH_TOKEN);
	return response.status(200).json({ message: CONSTANTS.LOGOUT_SUCCESS });
};

export const logoutSpecific = async (
	request: UserRequest,
	response: Response
) => {
	// check does user and deviceId exist
	const user = request.user;
	const { deviceId } = request.body;
	if (!user || !user?.id || !deviceId)
		throw new BadRequestError(CONSTANTS.ERRORS.MISSING_USER_OR_DEVICE_ID);

	// soft delete specific device refresh tokens
	const updated = await prisma.refreshToken.updateMany({
		where: {
			userId: user.id,
			deviceIdHash: deviceId,
			isRevoked: false,
		},
		data: {
			isRevoked: true,
		},
	});
	logger.info(
		{
			userId: user.id,
			deviceIdHash: deviceId,
		},
		CONSTANTS.TOKEN_MARKED_EXPIRED(updated.count)
	);

	return response.status(200).json({ message: CONSTANTS.LOGOUT_SUCCESS });
};

export const logoutAll = async (request: UserRequest, response: Response) => {
	// check does user exist
	const user = request.user;

	// soft delete all device refresh tokens
	const updated = await prisma.refreshToken.updateMany({
		where: {
			userId: user!.id,
			isRevoked: false,
		},
		data: {
			isRevoked: true,
		},
	});
	logger.info(
		{
			userId: user!.id,
		},
		CONSTANTS.TOKEN_MARKED_EXPIRED(updated.count)
	);

	return response.status(200).json({ message: CONSTANTS.LOGOUT_SUCCESS });
};

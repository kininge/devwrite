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
	InternalServerError,
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
	if (!email || !password) {
		new BadRequestError(CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD);
		return response
			.status(400)
			.json({ error: CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD });
	}
	if (!deviceId) {
		new BadRequestError(CONSTANTS.ERRORS.MISSING_DEVICE_ID);
		return response
			.status(400)
			.json({ error: CONSTANTS.ERRORS.MISSING_DEVICE_ID });
	}

	try {
		// check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			new ConflictError(CONSTANTS.ERRORS.USER_ALREADY_EXIST);
			return response
				.status(409)
				.json({ error: CONSTANTS.ERRORS.USER_ALREADY_EXIST });
		}

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
		logger.info(CONSTANTS.NEW_USER_GENERATED(newUser.email), {
			userId: newUser.id,
			email: newUser.email,
			name: newUser.name || "---",
			image: newUser.image || "---",
		});

		const { accessToken, refreshToken } = await generateTokens(
			newUser.id,
			newUser.email,
			newUser.name || "---",
			deviceId,
			deviceInfo,
			ipAddress
		);
		logger.info(CONSTANTS.NEW_TOKEN_GENERATED(newUser.email), {
			userId: newUser.id,
		});

		return setAuthCookies(response, accessToken, refreshToken)
			.status(201)
			.json({
				id: newUser.id,
			});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		new InternalServerError(errorMessage);
		return response
			.status(500)
			.json({ error: CONSTANTS.ERRORS.INTERNAL_SERVER_ERROR });
	}
};

export const login = async (request: Request, response: Response) => {
	const { email, password } = request.body;
	// from request headers
	const deviceId = request.get("X-Device-ID");
	const deviceInfo = request.get("User-Agent");
	const ipAddress = request.ip;

	// validate input
	if (!email || !password) {
		new BadRequestError(CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD);
		return response
			.status(400)
			.json({ error: CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD });
	}
	if (!deviceId) {
		new BadRequestError(CONSTANTS.ERRORS.MISSING_DEVICE_ID);
		return response
			.status(400)
			.json({ error: CONSTANTS.ERRORS.MISSING_DEVICE_ID });
	}

	try {
		// check if user exists and password is correct
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			new NotFoundError(CONSTANTS.USER_NOT_FOUND(email));
			return response
				.status(404)
				.json({ error: CONSTANTS.ERRORS.INVALID_CREDENTIALS });
		}
		// password is hashed, so we need to compare it
		const isPasswordValid = await bcrypt.compare(
			password,
			user.password ?? ""
		);
		if (!isPasswordValid) {
			new BadRequestError(CONSTANTS.PASSWORD_NOT_MATCHED(email));
			return response
				.status(401)
				.json({ error: CONSTANTS.ERRORS.INVALID_CREDENTIALS });
		}

		// mark existing refresh tokens as revoked --- soft delete
		const deviceIdHash = createHash("sha256")
			.update(deviceId)
			.digest("hex");
		await prisma.refreshToken.updateMany({
			where: { userId: user.id, deviceIdHash, isRevoked: false },
			data: { isRevoked: true }, // set isRevoked to true
		});

		// generate access and refresh tokens
		const { accessToken, refreshToken } = await generateTokens(
			user.id,
			user.email,
			user.name || "---",
			deviceId,
			deviceInfo,
			ipAddress
		);
		logger.info(CONSTANTS.NEW_TOKEN_GENERATED(user.email), {
			userId: user.id,
			email: user.email,
			name: user.name || "---",
			image: user.image || "---",
		});
		return setAuthCookies(response, accessToken, refreshToken)
			.status(200)
			.json({
				id: user.id,
			});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		new InternalServerError(errorMessage);
		return response
			.status(500)
			.json({ error: CONSTANTS.ERRORS.INTERNAL_SERVER_ERROR });
	}
};

export const refreshToken = async (request: Request, response: Response) => {
	try {
		// from request headers
		const deviceId = request.get("X-Device-ID");
		const deviceInfo = request.get("User-Agent");
		const ipAddress = request.ip;
		// validate device id
		validateDevice(response, deviceId);
		const deviceIdHash = createHash("sha256")
			.update(deviceId!)
			.digest("hex");

		const currentRefreshToken = getRefreshToken(request);
		const currentAccessToken = request.cookies[CONSTANTS.ACCESS_TOKEN];
		if (!currentRefreshToken || !currentAccessToken) {
			new BadRequestError(CONSTANTS.ERRORS.MISSING_REFRESH_TOKEN);
			return response
				.status(400)
				.json({ error: CONSTANTS.ERRORS.MISSING_REFRESH_TOKEN });
		}

		// verify the refresh token
		const refreshTokenPayload = verifyRefreshToken(currentRefreshToken);
		if (!refreshTokenPayload || !refreshTokenPayload.refreshTokenId) {
			new UnauthorizedError(CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN);
			return response
				.status(401)
				.json({ error: CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN });
		}

		// unfold access token payload
		const accessTokenPayload = jwt.decode(currentAccessToken) as any;

		// check old refresh token
		const refreshTokenRecord = await prisma.refreshToken.findUnique({
			where: { id: refreshTokenPayload.refreshTokenId, isRevoked: false },
		});
		if (!refreshTokenRecord) {
			// token not found so ---> revoke all tokens for this device
			await prisma.refreshToken.updateMany({
				where: {
					userId: accessTokenPayload.userId,
					deviceIdHash: deviceIdHash,
				},
				data: { isRevoked: true },
			});

			new UnauthorizedError(CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN);
			return response
				.status(401)
				.json({ error: CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN });
		}

		const userId = refreshTokenPayload.userId;
		const email = accessTokenPayload.email;
		const name = accessTokenPayload.name;
		const image = accessTokenPayload.image || "---";

		// soft delete the old refresh token
		await prisma.refreshToken.update({
			where: { id: refreshTokenPayload.refreshTokenId },
			data: { isRevoked: true },
		});

		// generate access and refresh tokens
		const { accessToken, refreshToken } = await generateTokens(
			userId,
			email,
			name,
			deviceIdHash,
			deviceInfo,
			ipAddress
		);
		logger.info(CONSTANTS.NEW_TOKEN_GENERATED(accessTokenPayload.email), {
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
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		new InternalServerError(errorMessage);
		return response
			.status(500)
			.json({ error: CONSTANTS.ERRORS.INTERNAL_SERVER_ERROR });
	}
};

// export const refreshToken = async (request: Request, response: Response) => {
// 	try {
// 		const currentRefreshToken = request.cookies[CONSTANTS.REFRESH_TOKEN];
// 		// missing refresh token
// 		if (!currentRefreshToken) {
// 			new UnauthorizedError(CONSTANTS.ERRORS.NO_REFRESH_TOKEN_PROVIDED);
// 			return response
// 				.status(401)
// 				.json({ error: CONSTANTS.ERRORS.NO_REFRESH_TOKEN_PROVIDED });
// 		}
// 		// decrypt the refresh token`
// 		const decoded = jwt.verify(
// 			currentRefreshToken,
// 			process.env.JWT_REFRESH_SECRET!
// 		) as { userId: string };

// 		// find the user by id
// 		const user = await prisma.user.findUnique({
// 			where: { id: decoded.userId },
// 		});
// 		// user not found
// 		if (!user) {
// 			new NotFoundError(CONSTANTS.USER_NOT_FOUND(decoded.userId));
// 			return response
// 				.status(404)
// 				.json({ error: CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN });
// 		}

// 		const { accessToken, refreshToken } = generateTokens(
// 			user.id,
// 			user.email,
// 			user.name || "---"
// 		);
// 		logger.info(CONSTANTS.NEW_TOKEN_GENERATED(user.email), {
// 			userId: user.id,
// 			email: user.email,
// 			name: user.name || "---",
// 			image: user.image || "---",
// 		});
// 		return setAuthCookies(response, accessToken, refreshToken)
// 			.status(200)
// 			.json({
// 				id: user.id,
// 				message: CONSTANTS.TOKENS_REFRESHED,
// 			});
// 	} catch (error) {
// 		new ForbiddenError(CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN);
// 		return response
// 			.status(403)
// 			.json({ error: CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN });
// 	}
// };

// export const logout = async (request: Request, response: Response) => {
// 	const deviceId = request.get("X-Device-ID");

// 	// mark existing refresh tokens as revoked --- soft delete
// 	const deviceIdHash = createHash("sha256").update(deviceId).digest("hex");
// 	await prisma.refreshToken.updateMany({
// 		where: { userId: user.id, deviceIdHash },
// 		data: { isRevoked: true }, // set isRevoked to true
// 	});

// 	response.clearCookie(CONSTANTS.ACCESS_TOKEN);
// 	response.clearCookie(CONSTANTS.REFRESH_TOKEN);
// 	return response.status(200).json({ message: CONSTANTS.LOGOUT_SUCCESS });
// };

export const logoutCurrent = async (request: Request, response: Response) => {
	// check refresh token exist
	const refreshToken = getRefreshToken(request);
	if (!refreshToken) {
		new BadRequestError(CONSTANTS.ERRORS.MISSING_REFRESH_TOKEN);
		return response
			.status(400)
			.json({ error: CONSTANTS.ERRORS.MISSING_REFRESH_TOKEN });
	}

	// verify the refresh token
	const refreshTokenPayload = verifyRefreshToken(refreshToken);
	if (!refreshTokenPayload || !refreshTokenPayload.refreshTokenId) {
		new UnauthorizedError(CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN);
		return response
			.status(401)
			.json({ error: CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN });
	}

	try {
		// soft delete request toke
		await prisma.refreshToken.update({
			where: { id: refreshTokenPayload.refreshTokenId },
			data: { isRevoked: true },
		});

		response.clearCookie(CONSTANTS.REFRESH_TOKEN);
		return response.status(200).json({ message: CONSTANTS.LOGOUT_SUCCESS });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		new InternalServerError(errorMessage);
		return response
			.status(500)
			.json({ error: CONSTANTS.ERRORS.INTERNAL_SERVER_ERROR });
	}
};

export const logoutSpecific = async (
	request: UserRequest,
	response: Response
) => {
	// check does user and deviceId exist
	const user = request.user;
	const { deviceId } = request.body;
	if (!user || !user?.id || !deviceId) {
		new BadRequestError(CONSTANTS.ERRORS.MISSING_USER_OR_DEVICE_ID);
		return response
			.status(400)
			.json({ error: CONSTANTS.ERRORS.MISSING_USER_OR_DEVICE_ID });
	}

	try {
		// soft delete specific device refresh tokens
		await prisma.refreshToken.updateMany({
			where: {
				userId: user.id,
				deviceIdHash: deviceId,
				isRevoked: false,
			},
			data: {
				isRevoked: true,
			},
		});

		return response.status(200).json({ message: CONSTANTS.LOGOUT_SUCCESS });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		new InternalServerError(errorMessage);
		return response
			.status(500)
			.json({ error: CONSTANTS.ERRORS.INTERNAL_SERVER_ERROR });
	}
};

export const logoutAll = async (request: UserRequest, response: Response) => {
	// check does user exist
	const user = request.user;

	try {
		// soft delete all device refresh tokens
		await prisma.refreshToken.updateMany({
			where: {
				userId: user!.id,
				isRevoked: false,
			},
			data: {
				isRevoked: true,
			},
		});

		return response.status(200).json({ message: CONSTANTS.LOGOUT_SUCCESS });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		new InternalServerError(errorMessage);
		return response
			.status(500)
			.json({ error: CONSTANTS.ERRORS.INTERNAL_SERVER_ERROR });
	}
};

/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import {
	BadRequestError,
	UnauthorizedError,
	ConflictError,
	NotFoundError,
	ForbiddenError,
} from "../utils/customErrors";
import logger from "../utils/logger";
import { CONSTANTS } from "../utils/constants";
import { generateTokens } from "../utils/generateTokens";
import { setAuthCookies } from "../utils/setAuthCookies";

export const signup = async (request: Request, response: Response) => {
	const { email, password, name, image } = request.body;

	// validate input
	if (!email || !password) {
		new BadRequestError(CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD);
		return response
			.status(400)
			.json({ error: CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD });
	}

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

	const { accessToken, refreshToken } = generateTokens(
		newUser.id,
		newUser.email,
		newUser.name || "---"
	);
	logger.info(CONSTANTS.NEW_TOKEN_GENERATED(newUser.email), {
		userId: newUser.id,
	});

	return setAuthCookies(response, accessToken, refreshToken)
		.status(201)
		.json({
			id: newUser.id,
		});
};

export const login = async (request: Request, response: Response) => {
	const { email, password } = request.body;

	// validate input
	if (!email || !password) {
		new BadRequestError(CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD);
		return response
			.status(400)
			.json({ error: CONSTANTS.ERRORS.MISSING_EMAIL_OR_PASSWORD });
	}

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
	const isPasswordValid = await bcrypt.compare(password, user.password ?? "");
	if (!isPasswordValid) {
		new BadRequestError(CONSTANTS.PASSWORD_NOT_MATCHED(email));
		return response
			.status(401)
			.json({ error: CONSTANTS.ERRORS.INVALID_CREDENTIALS });
	}

	const { accessToken, refreshToken } = generateTokens(
		user.id,
		user.email,
		user.name || "---"
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
};

export const refreshToken = async (request: Request, response: Response) => {
	try {
		const currentRefreshToken = request.cookies[CONSTANTS.REFRESH_TOKEN];
		// missing refresh token
		if (!currentRefreshToken) {
			new UnauthorizedError(CONSTANTS.ERRORS.NO_REFRESH_TOKEN_PROVIDED);
			return response
				.status(401)
				.json({ error: CONSTANTS.ERRORS.NO_REFRESH_TOKEN_PROVIDED });
		}
		// decrypt the refresh token`
		const decoded = jwt.verify(
			currentRefreshToken,
			process.env.JWT_REFRESH_SECRET!
		) as { userId: string };

		// find the user by id
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});
		// user not found
		if (!user) {
			new NotFoundError(CONSTANTS.USER_NOT_FOUND(decoded.userId));
			return response
				.status(404)
				.json({ error: CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN });
		}

		const { accessToken, refreshToken } = generateTokens(
			user.id,
			user.email,
			user.name || "---"
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
				message: CONSTANTS.TOKENS_REFRESHED,
			});
	} catch (error) {
		new ForbiddenError(CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN);
		return response
			.status(403)
			.json({ error: CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN });
	}
};

export const logout = async (request: Request, response: Response) => {
	response.clearCookie(CONSTANTS.ACCESS_TOKEN);
	response.clearCookie(CONSTANTS.REFRESH_TOKEN);
	return response.status(200).json({ message: CONSTANTS.LOGOUT_SUCCESS });
};

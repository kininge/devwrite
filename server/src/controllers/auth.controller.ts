/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prisma from "../utils/prisma";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { BadRequestError, ConflictError } from "../utils/customErrors";
import logger from "../utils/logger";

export const signup = async (request: Request, response: Response) => {
	const { email, password, name, image } = request.body;

	// validate input
	if (!email || !password) {
		new BadRequestError("Email and password required.");
		return response
			.status(400)
			.json({ error: "Email and password required." });
	}

	// check if user already exists
	const existingUser = await prisma.user.findUnique({
		where: { email },
	});
	if (existingUser) {
		new ConflictError("User already exists.");
		return response.status(409).json({ error: "User already exists." });
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
	logger.info(`New user created: ${newUser.email}`, {
		userId: newUser.id,
		email: newUser.email,
		name: newUser.name || "---",
		image: newUser.image || "---",
	});

	const accessToken = generateAccessToken({
		userId: newUser.id,
		email: newUser.email,
		name: newUser.name || "---",
	});
	const refreshToken = generateRefreshToken({
		userId: newUser.id,
	});
	logger.info(
		`Access and refresh tokens generated for user: ${newUser.email}`,
		{
			userId: newUser.id,
		}
	);

	return response
		.cookie("access_token", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000, // 15 minutes
		})
		.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
		})
		.status(201)
		.json({
			id: newUser.id,
		});
};

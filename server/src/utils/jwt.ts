/** @format */

import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (payload: {
	userId: string;
	email: string;
	name: string;
}) => {
	return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
};

export const generateRefreshToken = (payload: { userId: string }) => {
	return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
		expiresIn: "30d",
	});
};

export const verifyAccessToken = (token: string) => {
	return jwt.verify(token, ACCESS_TOKEN_SECRET) as {
		userId: string;
		email: string;
		name: string;
	};
};

export const verifyRefreshToken = (token: string) => {
	return jwt.verify(token, REFRESH_TOKEN_SECRET) as {
		userId: string;
	};
};

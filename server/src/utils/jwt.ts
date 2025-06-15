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

export const generateRefreshToken = (payload: {
	userId: string;
	refreshTokenId: string;
	deviceId: string;
}) => {
	return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
		expiresIn: "30d",
	});
};

export const verifyAccessToken = (
	token: string
): {
	userId: string;
	email: string;
	name: string;
} | null => {
	try {
		const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
		return {
			userId: payload.userId,
			email: payload.email,
			name: payload.name,
		};
	} catch (error) {
		return null;
	}
};

export const verifyRefreshToken = (
	token: string
): {
	userId: string;
	refreshTokenId: string;
	deviceId: string;
} | null => {
	try {
		const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as any;
		return {
			userId: payload.userId,
			deviceId: payload.deviceId,
			refreshTokenId: payload.refreshTokenId,
		};
	} catch (error) {
		return null;
	}
};

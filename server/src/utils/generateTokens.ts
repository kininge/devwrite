/** @format */

import { generateAccessToken, generateRefreshToken } from "./jwt";

export const generateTokens = (userId: string, email: string, name: string) => {
	const accessToken = generateAccessToken({
		userId,
		email,
		name,
	});
	const refreshToken = generateRefreshToken({
		userId,
	});
	return { accessToken, refreshToken };
};

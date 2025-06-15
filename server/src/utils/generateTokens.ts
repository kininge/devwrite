/** @format */

import { generateAccessToken, generateRefreshToken } from "./jwt";
import { createHash } from "crypto";
import prisma from "./prisma";

export const generateTokens = async (
	userId: string,
	email: string,
	name: string,
	deviceId: string,
	deviceInfo?: string,
	ipAddress?: string
) => {
	const accessToken = generateAccessToken({
		userId,
		email,
		name,
	});

	const deviceIdHash = createHash("sha256").update(deviceId).digest("hex");
	const refreshTokenRecord = await prisma.refreshToken.create({
		data: {
			userId,
			deviceIdHash,
			deviceInfo,
			ipAddress: ipAddress || null,
			lastUsedAt: new Date(),
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
		},
	});

	const refreshToken = generateRefreshToken({
		userId,
		refreshTokenId: refreshTokenRecord.id,
		deviceId: deviceIdHash,
	});
	return { accessToken, refreshToken };
};

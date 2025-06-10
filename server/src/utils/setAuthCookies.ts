/** @format */

import { CONSTANTS } from "./constants";
import { Response } from "express";

export const setAuthCookies = (
	response: Response,
	accessToken: string,
	refreshToken: string
) => {
	return response
		.cookie(CONSTANTS.ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === CONSTANTS.PRODUCTION,
			sameSite: "strict",
			maxAge: 15 * 60 * 1000, // 15 minutes
		})
		.cookie(CONSTANTS.REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === CONSTANTS.PRODUCTION,
			sameSite: "strict",
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
		});
};

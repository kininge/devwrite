/** @format */

import { Request } from "express";
import { CONSTANTS } from "./constants";

export const getRefreshToken = (request: Request): string | null => {
	// Extract the refresh token from cookies
	let currentRefreshToken = request.cookies[CONSTANTS.REFRESH_TOKEN];
	if (currentRefreshToken) {
		return currentRefreshToken;
	}

	// get refresh token in header
	currentRefreshToken = request.headers["x-refresh-token"];
	if (currentRefreshToken) return currentRefreshToken;

	return null;
};

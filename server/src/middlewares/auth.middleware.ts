/** @format */

import { Response, NextFunction } from "express";
import { CONSTANTS } from "../utils/constants";
import { UnauthorizedError } from "../utils/customErrors";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types/models";

export const authMiddleware = (
	request: UserRequest,
	response: Response,
	next: NextFunction
): void => {
	// Check if the access token is present in the cookies
	const accessToken = request.cookies[CONSTANTS.ACCESS_TOKEN];
	if (!accessToken) {
		new UnauthorizedError(CONSTANTS.ERRORS.INVALID_CREDENTIALS);
		response
			.status(401)
			.json({ error: CONSTANTS.ERRORS.INVALID_CREDENTIALS });
		return;
	}

	try {
		const decoded = jwt.verify(
			accessToken,
			process.env.JWT_SECRET as string
		) as jwt.JwtPayload;
		request.user = {
			id: decoded.userId,
			email: decoded.email,
			name: decoded.name || "---",
			image: decoded.image || "---",
		};
		next();
	} catch (error) {
		new UnauthorizedError(CONSTANTS.ERRORS.INVALID_CREDENTIALS);
		response
			.status(401)
			.json({ error: CONSTANTS.ERRORS.INVALID_CREDENTIALS });
		return;
	}
};

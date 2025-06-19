/** @format */

import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../types/models";
import { CustomError } from "../utils/customErrors";
import logger from "../utils/logger";
import { CONSTANTS } from "../utils/constants";

export function errorMiddleware(
	error: Error,
	request: Request | UserRequest,
	response: Response,
	next: NextFunction
) {
	if (error instanceof CustomError) {
		response.status(error.statusCode).json({
			error: error.message,
		});
	} else {
		// Handle unexpected errors
		logger.error(
			{
				errorStack: error.stack,
			},
			CONSTANTS.ERRORS.UNHANDLED_ERROR
		);
		response.status(500).json({
			error: CONSTANTS.ERRORS.INTERNAL_SERVER_ERROR,
		});
	}

	next();
}

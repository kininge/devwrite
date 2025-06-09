/** @format */

import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const requestMiddleware = (
	request: Request,
	response: Response,
	next: NextFunction
): void => {
	const startTime = Date.now(); // Record the start time of the request
	// Log the request method and URL

	logger.info(
		{
			requestId: (request as any).id,
			requestUrl: request.originalUrl,
			requestQuery: request.query,
			requestParams: request.params,
			requestTime: new Date(startTime).toISOString(),
			requestUserAgent: request.get("User-Agent"),
			requestIP: request.ip,
			requestHeaders: request.headers,
			requestBody: request.body,
		},
		`Request: ${request.method} ${request.protocol}://${request.hostname}${
			process.env.PORT ? `:${process.env.PORT}` : ""
		}${request.url}`
	);

	logger.info(
		{
			responseTime: new Date(Date.now()).toISOString(),
			responseDuration: `${Date.now() - startTime}ms`,
			responseHeaders: response.getHeaders(),
			responseBody: response.locals.data || null, // Assuming response.locals.data is set in the route handler
		},
		"Response sent"
	);
	// Call the next middleware in the stack
	next();
};

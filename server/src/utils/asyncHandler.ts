/** @format */

import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../types/models";

export const asyncHandler = (
	fn: (
		request: Request | UserRequest,
		response: Response,
		next: NextFunction
	) => Promise<any>
) => {
	return (
		request: Request | UserRequest,
		response: Response,
		next: NextFunction
	) => fn(request, response, next).catch(next);
};

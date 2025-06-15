/** @format */

import { CONSTANTS } from "./constants";
import { BadRequestError } from "./customErrors";
import { Response } from "express";

export const validateDevice = (response: Response, deviceId?: string) => {
	if (!deviceId) {
		new BadRequestError(CONSTANTS.ERRORS.MISSING_DEVICE_ID);
		return response
			.status(400)
			.json({ error: CONSTANTS.ERRORS.MISSING_DEVICE_ID });
	}
};

/** @format */

import { CONSTANTS } from "./constants";
import { BadRequestError } from "./customErrors";
import { Response } from "express";

export const validateDevice = (deviceId?: string) => {
	if (!deviceId)
		throw new BadRequestError(CONSTANTS.ERRORS.MISSING_DEVICE_ID);
};

/** @format */
import { Request } from "express";

export interface UserRequest extends Request {
	user?: {
		id: string;
		email: string;
		name?: string;
		image?: string | null;
	};
}

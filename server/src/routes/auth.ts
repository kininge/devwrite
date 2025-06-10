/** @format */

import express, { Request, Response, NextFunction } from "express";
import { signup, login } from "../controllers/auth.controller";
import { ACTIONS } from "../utils/paths";

const router = express.Router();

// Route to handle user signup
router.post(
	ACTIONS.SIGNUP,
	(request: Request, response: Response, next: NextFunction) => {
		Promise.resolve(signup(request, response)).catch(next);
	}
);

// Route to handle user login
router.post(
	ACTIONS.LOGIN,
	(request: Request, response: Response, next: NextFunction) => {
		Promise.resolve(login(request, response)).catch(next);
	}
);

export default router;

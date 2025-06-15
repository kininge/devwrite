/** @format */

import express, { Request, Response, NextFunction } from "express";
import {
	signup,
	login,
	// refreshToken,
	logoutCurrent,
	logoutSpecific,
	logoutAll,
} from "../controllers/auth.controller";
import { ACTIONS } from "../utils/paths";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRequest } from "../types/models";

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

// Route to refresh user tokens
// router.post(
// 	ACTIONS.REFRESH_TOKEN,
// 	(request: Request, response: Response, next: NextFunction) => {
// 		Promise.resolve(refreshToken(request, response)).catch(next);
// 	}
// );

// Route to handle user logout-current
router.post(
	ACTIONS.LOGOUT_CURRENT,
	(request: Request, response: Response, next: NextFunction) => {
		Promise.resolve(logoutCurrent(request, response)).catch(next);
	}
);

// Route to handle user logout-specific
router.post(
	ACTIONS.LOGOUT_SPECIFIC,
	authMiddleware,
	(request: UserRequest, response: Response, next: NextFunction) => {
		Promise.resolve(logoutSpecific(request, response)).catch(next);
	}
);

// Route to handle user logout-all
router.post(
	ACTIONS.LOGOUT_ALL,
	authMiddleware,
	(request: UserRequest, response: Response, next: NextFunction) => {
		Promise.resolve(logoutAll(request, response)).catch(next);
	}
);

export default router;

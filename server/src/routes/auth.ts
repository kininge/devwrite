/** @format */

import express, { Request, Response, NextFunction } from "express";
import {
	signup,
	login,
	refreshToken,
	logoutCurrent,
	logoutSpecific,
	logoutAll,
} from "../controllers/auth.controller";
import { ACTIONS } from "../utils/paths";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRequest } from "../types/models";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

// Route to handle user signup
router.post(ACTIONS.SIGNUP, asyncHandler(signup));

// Route to handle user login
router.post(ACTIONS.LOGIN, asyncHandler(login));

// Route to refresh user tokens
router.post(ACTIONS.REFRESH_TOKEN, asyncHandler(refreshToken));

// Route to handle user logout-current
router.post(ACTIONS.LOGOUT_CURRENT, asyncHandler(logoutCurrent));

// Route to handle user logout-specific
router.post(
	ACTIONS.LOGOUT_SPECIFIC,
	authMiddleware,
	asyncHandler(logoutSpecific)
);

// Route to handle user logout-all
router.post(ACTIONS.LOGOUT_ALL, authMiddleware, asyncHandler(logoutAll));

export default router;

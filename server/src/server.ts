/** @format */

import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import { PATHS } from "./utils/paths";
import { requestMiddleware } from "./middlewares/request.middleware";
import logger from "./utils/logger";
import { CONSTANTS } from "./utils/constants";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express(); // Create an Express application
app.use(requestMiddleware); // Apply the request middleware to log requests
const PORT = process.env.PORT; // Set the port for the server
app.use(cors({ origin: CONSTANTS.ALLOWED_CORS_ORIGINS, credentials: true })); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies from request headers

// Root route
app.get(PATHS.BASE, (request: Request, response: Response) => {
	logger.info(CONSTANTS.ROOT_API_CALLED); // Log the access to the root route
	response.send(CONSTANTS.APP_WELCOME_MESSAGE); // Respond with a welcome message
});
app.use(PATHS.AUTH_VERSION_1, authRoutes); // auth routes

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(
	PORT,
	() => logger.info(CONSTANTS.SERVER_RUN_MESSAGE(PORT)) // Log the server URL
);

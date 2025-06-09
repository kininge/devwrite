/** @format */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import { PATHS } from "./utils/paths";
import { requestMiddleware } from "./middlewares/request.middleware";
import logger from "./utils/logger";

const app = express(); // Create an Express application
app.use(requestMiddleware); // Apply the request middleware to log requests
const PORT = process.env.PORT || 3000; // Set the port for the server
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies from request headers

// routers
app.get("/", (req, res) => {
	// Root route
	// Respond with a welcome message
	res.send("Welcome to the DevWrite!");
});
app.use(PATHS.AUTH_VERSION_1, authRoutes); // auth routes

app.listen(PORT, () => {
	// Start the server
	logger.info(`DevWrite Service is running on http://localhost:${PORT}`); // Log the server URL
});

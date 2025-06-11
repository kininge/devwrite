/** @format */

export const CONSTANTS = {
	APP_NAME: "DevWrite",
	APP_WELCOME_MESSAGE: "Welcome to the DevWrite!",
	SERVER_RUN_MESSAGE: (PORT: string | undefined) =>
		`DevWrite Service is running on http://localhost:${PORT}`,
	ROOT_API_CALLED: "Root route accessed",
	ALLOWED_CORS_ORIGINS: ["http://localhost:5173", "https://devwrite.app"],
	NEW_USER_GENERATED: (email: string) => `New user created: ${email}`,
	NEW_TOKEN_GENERATED: (email: string) =>
		`Access and refresh tokens generated for user: ${email}`,
	ACCESS_TOKEN: "access_token",
	REFRESH_TOKEN: "refresh_token",
	PRODUCTION: "production",
	USER_NOT_FOUND: (email: string) => `User not found for ${email}`,
	PASSWORD_NOT_MATCHED: (email: string) =>
		`Password does not match for ${email}`,
	TOKENS_REFRESHED: "Tokens refreshed",
	ERRORS: {
		MISSING_EMAIL_OR_PASSWORD: "Email and password required.",
		USER_ALREADY_EXIST: "User already exists.",
		INVALID_CREDENTIALS: "Invalid credentials provided.",
		INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
		NO_REFRESH_TOKEN_PROVIDED: "No refresh token provided",
	},
};

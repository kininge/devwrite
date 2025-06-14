/** @format */

import pino from "pino";

const logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:standard",
			ignore: "pid",
		},
	},
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

export default logger;

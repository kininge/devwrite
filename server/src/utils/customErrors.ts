/** @format */

import logger from "./logger";

export class CustomError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	constructor(message: string, statusCode: number, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		logger.error(
			{
				name: this.name,
				statusCode: this.statusCode,
				isOperational: this.isOperational,
				stack: this.stack,
			},
			this.message
		);

		// Set the prototype explicitly to maintain the correct prototype chain
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
export class BadRequestError extends CustomError {
	constructor(message: string) {
		super(message, 400);
		this.name = "BadRequestError";
	}
}
export class UnauthorizedError extends CustomError {
	constructor(message: string) {
		super(message, 401);
		this.name = "UnauthorizedError";
	}
}
export class ForbiddenError extends CustomError {
	constructor(message: string) {
		super(message, 403);
		this.name = "ForbiddenError";
	}
}
export class NotFoundError extends CustomError {
	constructor(message: string) {
		super(message, 404);
		this.name = "NotFoundError";
	}
}
export class InternalServerError extends CustomError {
	constructor(message: string) {
		super(message, 500);
		this.name = "InternalServerError";
	}
}
export class ConflictError extends CustomError {
	constructor(message: string) {
		super(message, 409);
		this.name = "ConflictError";
	}
}
export class ServiceUnavailableError extends CustomError {
	constructor(message: string) {
		super(message, 503);
		this.name = "ServiceUnavailableError";
	}
}
export class ValidationError extends CustomError {
	constructor(message: string) {
		super(message, 422);
		this.name = "ValidationError";
	}
}
export class RateLimitError extends CustomError {
	constructor(message: string) {
		super(message, 429);
		this.name = "RateLimitError";
	}
}
export class NotImplementedError extends CustomError {
	constructor(message: string) {
		super(message, 501);
		this.name = "NotImplementedError";
	}
}
export class BadGatewayError extends CustomError {
	constructor(message: string) {
		super(message, 502);
		this.name = "BadGatewayError";
	}
}
export class GatewayTimeoutError extends CustomError {
	constructor(message: string) {
		super(message, 504);
		this.name = "GatewayTimeoutError";
	}
}
export class PreconditionFailedError extends CustomError {
	constructor(message: string) {
		super(message, 412);
		this.name = "PreconditionFailedError";
	}
}
export class TooManyRequestsError extends CustomError {
	constructor(message: string) {
		super(message, 429);
		this.name = "TooManyRequestsError";
	}
}
export class UnprocessableEntityError extends CustomError {
	constructor(message: string) {
		super(message, 422);
		this.name = "UnprocessableEntityError";
	}
}
export class ExpectationFailedError extends CustomError {
	constructor(message: string) {
		super(message, 417);
		this.name = "ExpectationFailedError";
	}
}
export class MisdirectedRequestError extends CustomError {
	constructor(message: string) {
		super(message, 421);
		this.name = "MisdirectedRequestError";
	}
}
export class InsufficientStorageError extends CustomError {
	constructor(message: string) {
		super(message, 507);
		this.name = "InsufficientStorageError";
	}
}
export class LoopDetectedError extends CustomError {
	constructor(message: string) {
		super(message, 508);
		this.name = "LoopDetectedError";
	}
}
export class NotExtendedError extends CustomError {
	constructor(message: string) {
		super(message, 510);
		this.name = "NotExtendedError";
	}
}
export class NetworkAuthenticationRequiredError extends CustomError {
	constructor(message: string) {
		super(message, 511);
		this.name = "NetworkAuthenticationRequiredError";
	}
}
export class PayloadTooLargeError extends CustomError {
	constructor(message: string) {
		super(message, 413);
		this.name = "PayloadTooLargeError";
	}
}
export class RequestHeaderFieldsTooLargeError extends CustomError {
	constructor(message: string) {
		super(message, 431);
		this.name = "RequestHeaderFieldsTooLargeError";
	}
}
export class NotAcceptableError extends CustomError {
	constructor(message: string) {
		super(message, 406);
		this.name = "NotAcceptableError";
	}
}
export class ProxyAuthenticationRequiredError extends CustomError {
	constructor(message: string) {
		super(message, 407);
		this.name = "ProxyAuthenticationRequiredError";
	}
}
export class UpgradeRequiredError extends CustomError {
	constructor(message: string) {
		super(message, 426);
		this.name = "UpgradeRequiredError";
	}
}
export class VariantAlsoNegotiatesError extends CustomError {
	constructor(message: string) {
		super(message, 506);
		this.name = "VariantAlsoNegotiatesError";
	}
}
export class TooEarlyError extends CustomError {
	constructor(message: string) {
		super(message, 425);
		this.name = "TooEarlyError";
	}
}
export class RequestTimeoutError extends CustomError {
	constructor(message: string) {
		super(message, 408);
		this.name = "RequestTimeoutError";
	}
}
export class GoneError extends CustomError {
	constructor(message: string) {
		super(message, 410);
		this.name = "GoneError";
	}
}
export class LengthRequiredError extends CustomError {
	constructor(message: string) {
		super(message, 411);
		this.name = "LengthRequiredError";
	}
}

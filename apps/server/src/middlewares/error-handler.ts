import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "@/utils/api-error";

export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (err instanceof ApiError) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
	}

	if (err instanceof ZodError) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors: err.issues.map((e) => ({
				path: e.path.join("."),
				message: e.message,
			})),
		});
	}

	console.error("Unhandled error:", err);

	return res.status(500).json({
		success: false,
		message: "Something went wrong",
	});
};

import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/api-error";
import { RegisterSellerSchema } from "./dto";
import {
	deleteSellerService,
	registerSellerService,
	sellerProfileService,
} from "./service";

export const registerSellerController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = RegisterSellerSchema.safeParse(req.body);

		if (!parsed.success) {
			throw ApiError.badRequest("Invalid data");
			// ZodError will be caught by errorHandler
		}

		const result = await registerSellerService(parsed.data, req.user.id);

		return res.status(201).json(result);
	} catch (error) {
		next(error); // Pass to error handler
	}
};

export const sellerProfileController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await sellerProfileService(req.user.id);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteSellerController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await deleteSellerService(req.user.id);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

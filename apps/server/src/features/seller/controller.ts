import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/api-error";
import {
	GetAllSellersQuerySchema,
	RegisterSellerSchema,
	SellerIdSchema,
} from "./dto";
import {
	approveSellerRegisterService,
	deleteSellerService,
	getAllSellerService,
	registerSellerService,
	sellerProfileService,
} from "./service";

// Admin
export const getAllSellerController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = GetAllSellersQuerySchema.safeParse(req.query);

		if (!parsed.success) {
			throw ApiError.badRequest("Invalid query parameters");
		}

		const result = await getAllSellerService(parsed.data);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const approveSellerRegisterController = async (
	req: Request<{ sellerId: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = SellerIdSchema.safeParse(req.params);

		if (!parsed.success) {
			throw ApiError.badRequest("Invalid seller ID");
		}

		const result = await approveSellerRegisterService(parsed.data.sellerId);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

// Seller
export const registerSellerController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = RegisterSellerSchema.safeParse(req.body);

		if (!parsed.success) {
			throw parsed.error;
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

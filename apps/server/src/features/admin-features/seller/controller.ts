import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/api-error";
import { GetAllSellersQuerySchema, SellerIdSchema } from "./dto";
import { approveSellerRegisterService, getAllSellerService } from "./service";

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

import type { NextFunction, Request, Response } from "express";
import { getAllProductsService } from "./service";

export const getAllProductsController = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await getAllProductsService();
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

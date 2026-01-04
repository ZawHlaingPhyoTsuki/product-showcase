import { auth } from "@tcl-ecommerce/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

export const requireAuth = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});

		if (!session) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		req.user = session.user;

		next();
	} catch (error) {
		console.error("Auth error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export const requireRoles = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		next();
	};
};

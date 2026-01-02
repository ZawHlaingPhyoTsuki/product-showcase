import { auth } from "@tcl-ecommerce/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

export async function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});

		if (!session) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		req.user = session.user;

		next();
	} catch (error) {
		console.error("Auth error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function isSellerAuth(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		if (req.user.isSeller !== true) {
			return res.status(403).json({ message: "Forbidden" });
		}

		next();
	} catch (error) {
		console.error("Auth error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

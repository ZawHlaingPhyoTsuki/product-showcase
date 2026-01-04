import { auth } from "@tcl-ecommerce/auth";
import prisma, { SellerStatus } from "@tcl-ecommerce/db";
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
	return async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		if (req.user.role === "SELLER") {
			const seller = await prisma.seller.findUnique({
				where: { userId: req.user.id },
				select: { status: true },
			});

			if (!seller) {
				return res.status(403).json({
					success: false,
					message: "Forbidden - you are not registered as a seller",
				});
			}

			if (seller.status !== "APPROVED") {
				return res
					.status(403)
					.json({
						success: false,
						message:
							seller.status === SellerStatus.PENDING
								? "Your seller account is still pending approval"
								: "Your seller account is not approved",
					});
			}

			next();
		}

		next();
	};
};

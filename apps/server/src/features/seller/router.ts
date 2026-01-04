import { Role } from "@tcl-ecommerce/db";
import { Router } from "express";
import { requireAuth, requireRoles } from "@/middlewares";
import {
	approveSellerRegisterController,
	deleteSellerController,
	getAllSellerController,
	registerSellerController,
	sellerProfileController,
} from "./controller";

const router: Router = Router();

// Admin
router.get(
	"/admin/sellers",
	requireAuth,
	requireRoles([Role.ADMIN]),
	getAllSellerController,
);
router.post(
	"/admin/sellers/approve/:sellerId",
	requireAuth,
	requireRoles([Role.ADMIN]),
	approveSellerRegisterController,
);

// Seller
router.post(
	"/seller/register",
	requireAuth,
	requireRoles([Role.CUSTOMER]),
	registerSellerController,
);
router.get("/seller/profile", requireAuth, sellerProfileController);
router.delete(
	"/seller",
	requireAuth,
	requireRoles([Role.SELLER]),
	deleteSellerController,
);

export default router;

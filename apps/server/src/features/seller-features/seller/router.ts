import { Role } from "@tcl-ecommerce/db";
import { Router } from "express";
import { requireRoles } from "@/middlewares";
import {
	deleteSellerController,
	registerSellerController,
	sellerProfileController,
} from "./controller";

const router: Router = Router();

router.post("/register", registerSellerController);
router.get("/profile", requireRoles([Role.SELLER]), sellerProfileController);
router.delete("/", requireRoles([Role.SELLER]), deleteSellerController);

export default router;

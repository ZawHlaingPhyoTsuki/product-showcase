import { Router } from "express";
import {
	approveSellerRegisterController,
	getAllSellerController,
} from "./controller";

const router: Router = Router();

router.get("/", getAllSellerController);
router.post("/approve/:sellerId", approveSellerRegisterController);

export default router;

import { Router } from "express";
import productRouter from "./product/router";
import sellerRouter from "./seller/router";

const router: Router = Router();

router.use("/", sellerRouter);
router.use("/products", productRouter);

export default router;

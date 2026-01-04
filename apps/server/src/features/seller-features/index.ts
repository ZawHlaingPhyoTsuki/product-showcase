import { Router } from "express";
import productRouter from "./product/router";
import sellerRouter from "./seller/router";

const router: Router = Router();

router.use("/sellers", sellerRouter);
router.use("/products", productRouter);

export default router;

import { Router } from "express";
import sellerRouter from "./seller/router";

const router: Router = Router();

router.use("/sellers", sellerRouter);

export default router;

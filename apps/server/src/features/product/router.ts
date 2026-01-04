import { Router } from "express";
import { getAllProductsController } from "./controller";

const router: Router = Router();

router.get("/", getAllProductsController);

export default router;

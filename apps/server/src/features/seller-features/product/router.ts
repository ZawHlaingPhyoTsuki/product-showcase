import { Router } from "express";

const router: Router = Router();

router.get("/", (_req, res) => {
	res.send("Hello World!");
});

export default router;

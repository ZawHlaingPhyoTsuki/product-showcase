import "./utils/cloudinary";
import { auth } from "@tcl-ecommerce/auth";
import { Role } from "@tcl-ecommerce/db";
import { env } from "@tcl-ecommerce/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
// ROUTES
import adminRouter from "./features/admin-features";
import customerRouter from "./features/customer-features";
import sellerRouter from "./features/seller-features";
// MIDDLEWARES
import { errorHandler, requireAuth, requireRoles } from "./middlewares";

const app = express();

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		// methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

app.use("/api/customers", customerRouter);
app.use("/api/sellers", requireAuth, sellerRouter);
app.use("/api/admins", requireAuth, requireRoles([Role.ADMIN]), adminRouter);

app.use(errorHandler);

app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});

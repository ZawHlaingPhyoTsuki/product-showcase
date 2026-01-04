import "./utils/cloudinary";
import { auth } from "@tcl-ecommerce/auth";
import { env } from "@tcl-ecommerce/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
// ROUTES
import productRouter from "./features/product/router";
import sellerRouter from "./features/seller/router";
// MIDDLEWARES
import { errorHandler } from "./middlewares";

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

app.use("/api/", sellerRouter);
app.use("/api/products", productRouter);

app.use(errorHandler);

app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});

import type { auth } from "@product-showcase/auth";

declare global {
	namespace Express {
		interface Request {
			user: (typeof auth.$Infer.Session)["user"];
		}
	}
}

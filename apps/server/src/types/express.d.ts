import type { auth } from "@tcl-ecommerce/auth";

declare global {
	namespace Express {
		interface Request {
			user: (typeof auth.$Infer.Session)["user"];
		}
	}
}

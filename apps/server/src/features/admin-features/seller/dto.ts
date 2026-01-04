import z from "zod";

export const SellerIdSchema = z.object({
	sellerId: z.uuidv4({ error: "Invalid seller ID format" }),
});

export const GetAllSellersQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
	sortBy: z.enum(["createdAt", "shopName"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SellerIdType = z.infer<typeof SellerIdSchema>;
export type GetAllSellersQueryType = z.infer<typeof GetAllSellersQuerySchema>;

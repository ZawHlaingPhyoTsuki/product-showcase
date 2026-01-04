import z from "zod";

export const RegisterSellerSchema = z.object({
	shopName: z
		.string()
		.min(3, "Shop name must be at least 3 characters")
		.max(100, "Shop name too long"),
	slug: z
		.string()
		.regex(
			/^[a-z0-9-]+$/,
			"Slug can only contain lowercase letters, numbers, and hyphens",
		)
		.min(3, "Slug must be at least 3 characters")
		.max(100)
		.optional(),
	bio: z.string().max(500, "Bio too long").optional(),
	phone: z.string().max(20).optional(),
	address: z.string().max(255).optional(),
});

export type RegisterSellerType = z.infer<typeof RegisterSellerSchema>;

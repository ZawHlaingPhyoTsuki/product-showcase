import type { PrismaClient } from "@tcl-ecommerce/db";
import slugify from "slugify";

export async function generateUniqueSlug(
	base: string,
	model: Pick<PrismaClient["seller"], "findUnique">, // More flexible
) {
	const slug = slugify(base, { lower: true, strict: true, trim: true });

	let uniqueSlug = slug;
	let suffix = 1;

	while (await model.findUnique({ where: { slug: uniqueSlug } })) {
		uniqueSlug = `${slug}-${suffix++}`;
	}

	return uniqueSlug;
}

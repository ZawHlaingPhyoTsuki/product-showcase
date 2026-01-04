import type { PrismaClient } from "@tcl-ecommerce/db";
import slugify from "slugify";
import { ApiError } from "./api-error";

export async function generateUniqueSlug(
	base: string,
	model: Pick<PrismaClient["seller"], "findUnique">,
) {
	const slug = slugify(base, { lower: true, strict: true, trim: true });

	let uniqueSlug = slug;
	let suffix = 1;
	const maxRetries = 100;

	while (
		suffix <= maxRetries &&
		(await model.findUnique({ where: { slug: uniqueSlug } }))
	) {
		uniqueSlug = `${slug}-${suffix++}`;
	}

	if (suffix > maxRetries) {
		throw ApiError.badRequest("Failed to generate a unique slug");
	}

	return uniqueSlug;
}

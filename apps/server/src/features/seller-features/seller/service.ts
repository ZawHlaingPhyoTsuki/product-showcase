import prisma, { Role, SellerStatus } from "@tcl-ecommerce/db";
import { ApiError } from "@/utils/api-error";
import { generateUniqueSlug } from "@/utils/generate-unique-slug";
import type { RegisterSellerType } from "./dto";

export const registerSellerService = async (
	data: RegisterSellerType,
	userId: string,
) => {
	const { shopName, slug, bio, phone, address } = data;

	// Check if user already has a seller profile
	const existingSeller = await prisma.seller.findUnique({
		where: { userId },
	});

	if (existingSeller) {
		throw ApiError.conflict("You are already registered as a seller");
	}

	// Generate unique slug
	const baseSlug = slug || shopName;
	const uniqueSlug = await generateUniqueSlug(baseSlug, prisma.seller);

	// Create seller in a transaction
	const seller = await prisma.$transaction(async (tx) => {
		const newSeller = await tx.seller.create({
			data: {
				shopName,
				slug: uniqueSlug,
				bio: bio || null,
				phone: phone || null,
				address: address || null,
				status: SellerStatus.PENDING,
				user: {
					connect: { id: userId },
				},
			},
		});

		await tx.user.update({
			where: { id: userId },
			data: { role: Role.SELLER },
		});

		return newSeller;
	});

	return {
		success: true,
		message: "Seller registration successful. Awaiting approval.",
		data: seller,
	};
};

export const sellerProfileService = async (userId: string) => {
	const seller = await prisma.seller.findUnique({
		where: { userId },
		select: {
			id: true,
			shopName: true,
			slug: true,
			bio: true,
			phone: true,
			address: true,
			status: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!seller) {
		throw ApiError.notFound("Seller profile not found");
	}

	return {
		success: true,
		message: "Seller profile retrieved successfully",
		data: seller,
	};
};

export const deleteSellerService = async (userId: string) => {
	const seller = await prisma.seller.findUnique({
		where: { userId },
	});

	if (!seller) {
		throw ApiError.notFound("Seller not found");
	}

	await prisma.seller.delete({
		where: { id: seller.id },
	});

	await prisma.user.update({
		where: { id: userId },
		data: { role: Role.CUSTOMER },
	});

	return {
		success: true,
		message: "Seller deleted successfully",
	};
};

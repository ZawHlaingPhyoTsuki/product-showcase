import prisma, { type Prisma, Role, SellerStatus } from "@tcl-ecommerce/db";
import { ApiError } from "@/utils/api-error";
import { generateUniqueSlug } from "@/utils/generate-unique-slug";
import type { GetAllSellersQueryType, RegisterSellerType } from "./dto";

// Admin
export const getAllSellerService = async (query: GetAllSellersQueryType) => {
	const { page, limit, search, status, sortBy, sortOrder } = query;

	const where: Prisma.SellerWhereInput = {
		...(search && {
			OR: [
				{ shopName: { contains: search, mode: "insensitive" } },
				{ slug: { contains: search, mode: "insensitive" } },
			],
		}),
		...(status && { status: status as SellerStatus }),
	};

	const [sellers, total] = await Promise.all([
		prisma.seller.findMany({
			where,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: {
				[sortBy]: sortOrder,
			},
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
				user: {
					select: {
						name: true,
						email: true,
						image: true,
					},
				},
			},
		}),
		prisma.seller.count({ where }),
	]);

	const totalPages = Math.ceil(total / limit);

	return {
		success: true,
		message: "Sellers retrieved successfully",
		data: {
			sellers,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1,
			},
		},
	};
};

export const approveSellerRegisterService = async (sellerId: string) => {
	const seller = await prisma.seller.findUnique({
		where: { id: sellerId },
	});

	if (!seller) {
		throw ApiError.notFound("Seller not found");
	}

	if (seller.status === SellerStatus.APPROVED) {
		throw ApiError.badRequest("Seller is already approved");
	}

	// await prisma.seller.update({
	// 	where: { id: sellerId },
	// 	data: { status: SellerStatus.APPROVED },
	// });

	await prisma.$transaction(async (tx) => {
		await tx.seller.update({
			where: { id: sellerId },
			data: { status: SellerStatus.APPROVED },
		});

		await tx.user.update({
			where: { id: seller.userId },
			data: { role: Role.SELLER },
		});
	});

	return {
		success: true,
		message: "Seller approved successfully",
	};
};

// Seller
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
	const seller = await prisma.seller.create({
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
		include: {
			products: true,
		},
	});

	if (!seller) {
		throw ApiError.notFound("Seller not found");
	}

	if (seller.products.length > 0) {
		throw ApiError.conflict(
			"Cannot delete seller with existing products. Please remove all products first.",
		);
	}

	await prisma.$transaction(async (tx) => {
		await tx.seller.delete({
			where: { id: seller.id },
		});

		await tx.user.update({
			where: { id: userId },
			data: { role: Role.CUSTOMER },
		});
	});

	return {
		success: true,
		message: "Seller deleted successfully",
	};
};

import prisma, { type Prisma, Role, SellerStatus } from "@tcl-ecommerce/db";
import { ApiError } from "@/utils/api-error";
import type { GetAllSellersQueryType } from "./dto";

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

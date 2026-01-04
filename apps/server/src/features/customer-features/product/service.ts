import prisma from "@tcl-ecommerce/db";

export const getAllProductsService = async () => {
	return await prisma.product.findMany({
		where: {
			archivedAt: null,
		},
	});
};

import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface ListProductByCategoryServiceProps {
  categoryId: string;
}

class ListProductByCategoryService {
  async execute({ categoryId }: ListProductByCategoryServiceProps) {
    const categoryExists = await prismaClient.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new AppError("Categoria nao existe", 404);
    }

    try {
      const products = await prismaClient.product.findMany({
        where: {
          categoryId,
          disabled: false,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          categoryId: true,
          banner: true,
          disabled: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: "desc",
        },
      });

      return products;
    } catch (error) {
      throw new AppError("Erro ao listar produtos da categoria", 500);
    }
  }
}

export { ListProductByCategoryService };

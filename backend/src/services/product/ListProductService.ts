import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface ListProductServiceProps {
  disabled?: string;
}

class ListProductService {
  async execute({ disabled }: ListProductServiceProps) {
    try {
      const products = await prismaClient.product.findMany({
        where: {
          disabled: disabled === "true" ? true : false,
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
      throw new AppError("Erro ao listar produtos", 500);
    }
  }
}

export { ListProductService };

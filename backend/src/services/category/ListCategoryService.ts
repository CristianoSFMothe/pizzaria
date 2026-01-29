import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

class ListCategoryService {
  async execute() {
    try {
      const categories = await prismaClient.category.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: {
          name: "desc",
        },
      });

      return categories;
    } catch (error) {
      throw new AppError("Erro ao listar categorias", 500);
    }
  }
}

export { ListCategoryService };

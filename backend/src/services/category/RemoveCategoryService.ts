import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface RemoveCategoryServiceProps {
  categoryId: string;
}

class RemoveCategoryService {
  async execute({ categoryId }: RemoveCategoryServiceProps) {
    const category = await prismaClient.category.findFirst({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        active: true,
      },
    });

    if (!category) {
      throw new AppError("Categoria nao encontrada", 404);
    }

    if (!category.active) {
      throw new AppError("Categoria ja desativada", 400);
    }

    try {
      await prismaClient.category.update({
        where: {
          id: categoryId,
        },
        data: {
          active: false,
        },
      });

      return { message: "Categoria desativada com sucesso" };
    } catch (error) {
      throw new AppError("Erro ao remover categoria", 500);
    }
  }
}

export { RemoveCategoryService };

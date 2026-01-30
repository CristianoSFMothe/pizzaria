import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface UpdateCategoryProps {
  categoryId: string;
  name: string;
}

class UpdateCategoryService {
  async execute({ categoryId, name }: UpdateCategoryProps) {
    const category = await prismaClient.category.findFirst({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) {
      throw new AppError("Categoria nao encontrada", 404);
    }

    if (category.name === name) {
      return category;
    }

    const categoryExists = await prismaClient.category.findFirst({
      where: {
        name,
        id: {
          not: categoryId,
        },
      },
      select: {
        id: true,
      },
    });

    if (categoryExists) {
      throw new AppError("Categoria ja cadastrada", 409);
    }

    try {
      const updatedCategory = await prismaClient.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedCategory;
    } catch (error) {
      throw new AppError("Erro ao atualizar categoria", 500);
    }
  }
}

export { UpdateCategoryService };

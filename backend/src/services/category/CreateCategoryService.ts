import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface CreateCategoryProps {
  name: string;
}

class CreateCategoryService {
  async execute({ name }: CreateCategoryProps) {
    const categoryExists = await prismaClient.category.findFirst({
      where: {
        name,
      },
    });

    if (categoryExists) {
      throw new AppError("Categoria ja cadastrada", 409);
    }

    try {
      const category = await prismaClient.category.create({
        data: {
          name,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      return category;
    } catch (error) {
      throw new AppError("Erro ao cadastrar categoria", 400);
    }
  }
}

export { CreateCategoryService };

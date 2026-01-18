import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface CreateCategoryProps {
  name: string;
}

class CreateCategoryService {
  async execute({ name }: CreateCategoryProps) {
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
      throw new AppError("Error ao cadastrar categoria", 400);
    }
  }
}

export { CreateCategoryService };

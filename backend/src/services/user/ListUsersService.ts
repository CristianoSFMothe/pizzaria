import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

class ListUsersService {
  async execute() {
    try {
      const users = await prismaClient.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          name: "desc",
        },
      });

      return users;
    } catch (error) {
      throw new AppError("Erro ao listar usuários", 500);
    }
  }
}

export { ListUsersService };

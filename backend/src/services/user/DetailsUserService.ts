import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

class DetailsUserService {
  async execute(userId: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      return user;
    } catch (err) {
      throw new AppError("Usuário não encontrado", 404);
    }
  }
}

export { DetailsUserService };

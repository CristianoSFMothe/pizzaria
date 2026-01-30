import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface UpdateUserRoleProps {
  userId: string;
}

class UpdateUserRoleService {
  async execute({ userId }: UpdateUserRoleProps) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      let nextRole: "ADMIN" | "STAFF";
      if (user.role === "STAFF") {
        nextRole = "ADMIN";
      } else if (user.role === "ADMIN") {
        nextRole = "STAFF";
      } else {
        throw new AppError("Role do usuário inválida", 400);
      }

      const updatedUser = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          role: nextRole,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("Erro ao atualizar role do usuário", 500);
    }
  }
}

export { UpdateUserRoleService };

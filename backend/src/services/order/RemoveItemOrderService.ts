import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface RemoveItemOrderServiceProps {
  itemId: string;
}

class RemoveItemOrderService {
  async execute({ itemId }: RemoveItemOrderServiceProps) {
    try {
      const itemExists = await prismaClient.item.findFirst({
        where: {
          id: itemId,
        },
      });

      if (!itemExists) {
        throw new AppError("Item nao encontrado", 404);
      }

      await prismaClient.item.delete({
        where: {
          id: itemId,
        },
      });

      return { message: "Item removido com sucesso" };
    } catch (error) {
      throw new AppError("Erro ao remover item do pedido", 500);
    }
  }
}

export { RemoveItemOrderService };

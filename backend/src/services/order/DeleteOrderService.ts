import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface DeleteOrderProps {
  orderId: string;
}

class DeleteOrderService {
  async execute({ orderId }: DeleteOrderProps) {
    try {
      const order = await prismaClient.order.findFirst({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new AppError("Falha ao deletar o pedido", 404);
      }

      await prismaClient.order.delete({
        where: {
          id: orderId,
        },
      });

      return { message: "Pedido deletado com sucesso!" };
    } catch (err) {
      throw new AppError("Falha ao deletar pedido", 500);
    }
  }
}

export { DeleteOrderService };

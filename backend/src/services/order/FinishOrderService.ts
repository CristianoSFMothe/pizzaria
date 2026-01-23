import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface FinishOrderProps {
  orderId: string;
}

class FinishOrderService {
  async execute({ orderId }: FinishOrderProps) {
    try {
      const order = await prismaClient.order.findFirst({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new AppError("Falha ao finalizar pedido", 404);
      }

      const updateOrder = await prismaClient.order.update({
        where: {
          id: orderId,
        },
        data: {
          draft: true,
        },
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
        },
      });

      return updateOrder;
    } catch (err) {
      console.log(err);
      throw new AppError("Falha ao finalizar pedido", 500);
    }
  }
}

export { FinishOrderService };

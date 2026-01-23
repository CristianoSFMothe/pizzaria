import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface SendOrderProps {
  name: string;
  orderId: string;
}

class SendOrderService {
  async execute({ name, orderId }: SendOrderProps) {
    try {
      const order = await prismaClient.order.findFirst({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new AppError("Falha ao enviar pedido", 404);
      }

      const updateOrder = await prismaClient.order.update({
        where: {
          id: orderId,
        },
        data: {
          draft: false,
          name: name,
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
      throw new AppError("Falha ao enviar pedido", 500);
    }
  }
}

export { SendOrderService };

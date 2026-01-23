import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface DetailOrderProps {
  orderId: string;
}

class DetailOrderService {
  async execute({ orderId }: DetailOrderProps) {
    try {
      const order = await prismaClient.order.findFirst({
        where: {
          id: orderId,
        },
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              id: true,
              amount: true,
              createdAt: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  description: true,
                  banner: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new AppError("Ordem não encontrada", 404);
      }

      return order;
    } catch (err) {
      console.log(err);
      throw new AppError("Falha ao buscar detalhes da ordem", 500);
    }
  }
}

export { DetailOrderService };

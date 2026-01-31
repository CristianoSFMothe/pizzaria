import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";

interface ListProductServiceProps {
  productId: string;
}

class DeleteProductService {
  async execute({ productId }: ListProductServiceProps) {
    try {
      await prismaClient.product.update({
        where: {
          id: productId,
        },
        data: {
          disabled: true,
        },
      });

      if (!productId) {
        throw new AppError("Produto não encontrado", 404);
      }

      return { message: "Produto deletado com sucesso" };
    } catch (error) {
      throw new AppError("Erro ao deletar produto", 500);
    }
  }
}

export { DeleteProductService };

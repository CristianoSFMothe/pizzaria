import { DeleteProductService } from "../../../src/services/product/DeleteProductService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    product: {
      update: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  product: {
    update: jest.Mock;
  };
};

describe("DeleteProductService", () => {
  beforeEach(() => {
    prismaMock.product.update.mockReset();
  });

  it("should disable the product.", async () => {
    prismaMock.product.update.mockResolvedValue({
      id: "product-id",
      disabled: true,
    });

    const service = new DeleteProductService();
    const result = await service.execute({ productId: "product-id" });

    expect(result).toEqual({ message: "Produto deletado com sucesso" });
    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: "product-id" },
      data: { disabled: true },
    });
  });

  it("should fail when there is a database error.", async () => {
    prismaMock.product.update.mockRejectedValue(new Error("DB error"));

    const service = new DeleteProductService();
    const promise = service.execute({ productId: "product-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao deletar produto",
      statusCode: 500,
    });
  });
});

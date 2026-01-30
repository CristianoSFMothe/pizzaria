import { RemoveItemOrderService } from "../../../src/services/order/RemoveItemOrderService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    item: {
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  item: {
    findFirst: jest.Mock;
    delete: jest.Mock;
  };
};

describe("RemoveItemOrderService", () => {
  beforeEach(() => {
    prismaMock.item.findFirst.mockReset();
    prismaMock.item.delete.mockReset();
  });

  it("should remove the item when it exists.", async () => {
    prismaMock.item.findFirst.mockResolvedValue({ id: "item-id" });
    prismaMock.item.delete.mockResolvedValue({});

    const service = new RemoveItemOrderService();
    const result = await service.execute({ itemId: "item-id" });

    expect(result).toEqual({ message: "Item removido com sucesso" });
    expect(prismaMock.item.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "item-id" },
      }),
    );
    expect(prismaMock.item.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "item-id" },
      }),
    );
  });

  it("should fail when the item does not exist.", async () => {
    prismaMock.item.findFirst.mockResolvedValue(null);

    const service = new RemoveItemOrderService();
    const promise = service.execute({ itemId: "item-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao remover item do pedido",
      statusCode: 500,
    });
    expect(prismaMock.item.delete).not.toHaveBeenCalled();
  });

  it("should fail when there is an error in the database.", async () => {
    prismaMock.item.findFirst.mockResolvedValue({ id: "item-id" });
    prismaMock.item.delete.mockRejectedValue(new Error("DB error"));

    const service = new RemoveItemOrderService();
    const promise = service.execute({ itemId: "item-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao remover item do pedido",
      statusCode: 500,
    });
  });
});

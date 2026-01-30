import { FinishOrderService } from "../../../src/services/order/FinishOrderService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    order: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  order: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
};

describe("FinishOrderService", () => {
  beforeEach(() => {
    prismaMock.order.findFirst.mockReset();
    prismaMock.order.update.mockReset();
  });

  it("should finish the order when it exists.", async () => {
    const orderResponse = {
      id: "order-id",
      table: 10,
      name: "Mesa 10",
      draft: true,
      status: false,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    };

    prismaMock.order.findFirst.mockResolvedValue({ id: "order-id" });
    prismaMock.order.update.mockResolvedValue(orderResponse);

    const service = new FinishOrderService();
    const result = await service.execute({ orderId: "order-id" });

    expect(result).toEqual(orderResponse);
    expect(prismaMock.order.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "order-id" },
      }),
    );
    expect(prismaMock.order.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "order-id" },
        data: { draft: true },
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
        },
      }),
    );
  });

  it("should fail when the order does not exist.", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);

    const service = new FinishOrderService();
    const promise = service.execute({ orderId: "order-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Falha ao finalizar pedido",
      statusCode: 500,
    });
    expect(prismaMock.order.update).not.toHaveBeenCalled();
  });

  it("should fail when there is an error in the database.", async () => {
    prismaMock.order.findFirst.mockResolvedValue({ id: "order-id" });
    prismaMock.order.update.mockRejectedValue(new Error("DB error"));

    const service = new FinishOrderService();
    const promise = service.execute({ orderId: "order-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Falha ao finalizar pedido",
      statusCode: 500,
    });
  });
});

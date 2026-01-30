import { DetailOrderService } from "../../../src/services/order/DetailOrderService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    order: {
      findFirst: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  order: {
    findFirst: jest.Mock;
  };
};

describe("DetailOrderService", () => {
  beforeEach(() => {
    prismaMock.order.findFirst.mockReset();
  });

  it("should return the order details.", async () => {
    const orderResponse = {
      id: "order-id",
      table: 10,
      name: "Mesa 10",
      draft: true,
      status: false,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      updatedAt: new Date("2025-01-01T00:00:00.000Z"),
      items: [
        {
          id: "item-id",
          amount: 2,
          createdAt: new Date("2025-01-01T00:00:00.000Z"),
          product: {
            id: "product-id",
            name: "Pizza Calabresa",
            price: 35,
            description: "Pizza com calabresa e cebola",
            banner: "https://example.com/pizza.png",
          },
        },
      ],
    };

    prismaMock.order.findFirst.mockResolvedValue(orderResponse);

    const service = new DetailOrderService();
    const result = await service.execute({ orderId: "order-id" });

    expect(result).toEqual(orderResponse);
    expect(prismaMock.order.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "order-id" },
      }),
    );
  });

  it("should fail when the request does not exist.", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);

    const service = new DetailOrderService();
    const promise = service.execute({ orderId: "order-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Falha ao buscar detalhes da ordem",
      statusCode: 500,
    });
  });

  it("should fail when there is an error in the database.", async () => {
    prismaMock.order.findFirst.mockRejectedValue(new Error("DB error"));

    const service = new DetailOrderService();
    const promise = service.execute({ orderId: "order-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Falha ao buscar detalhes da ordem",
      statusCode: 500,
    });
  });
});

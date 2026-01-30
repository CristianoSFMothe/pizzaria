import { AddItemOrderService } from "../../../src/services/order/AddItemOrderService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    order: {
      findFirst: jest.fn(),
    },
    product: {
      findFirst: jest.fn(),
    },
    item: {
      create: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  order: {
    findFirst: jest.Mock;
  };
  product: {
    findFirst: jest.Mock;
  };
  item: {
    create: jest.Mock;
  };
};

describe("AddItemOrderService", () => {
  beforeEach(() => {
    prismaMock.order.findFirst.mockReset();
    prismaMock.product.findFirst.mockReset();
    prismaMock.item.create.mockReset();
  });

  it("should add an item when order and product exist.", async () => {
    const itemResponse = {
      id: "item-id",
      amount: 2,
      orderId: "order-id",
      productId: "product-id",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      product: {
        id: "product-id",
        name: "Pizza Calabresa",
        price: 35,
        description: "Pizza com calabresa",
        banner: "https://example.com/pizza.png",
      },
    };

    prismaMock.order.findFirst.mockResolvedValue({ id: "order-id" });
    prismaMock.product.findFirst.mockResolvedValue({
      id: "product-id",
      disabled: false,
    });
    prismaMock.item.create.mockResolvedValue(itemResponse);

    const service = new AddItemOrderService();
    const result = await service.execute({
      orderId: "order-id",
      productId: "product-id",
      amount: 2,
    });

    expect(result).toEqual(itemResponse);
    expect(prismaMock.order.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "order-id" },
      }),
    );
    expect(prismaMock.product.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "product-id", disabled: false },
      }),
    );
    expect(prismaMock.item.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          orderId: "order-id",
          productId: "product-id",
          amount: 2,
        },
        select: {
          id: true,
          amount: true,
          orderId: true,
          productId: true,
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
      }),
    );
  });

  it("should fail when the order does not exist.", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);

    const service = new AddItemOrderService();
    const promise = service.execute({
      orderId: "order-id",
      productId: "product-id",
      amount: 2,
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Pedido não encontrado",
      statusCode: 404,
    });
    expect(prismaMock.product.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.item.create).not.toHaveBeenCalled();
  });

  it("should fail when the product does not exist.", async () => {
    prismaMock.order.findFirst.mockResolvedValue({ id: "order-id" });
    prismaMock.product.findFirst.mockResolvedValue(null);

    const service = new AddItemOrderService();
    const promise = service.execute({
      orderId: "order-id",
      productId: "product-id",
      amount: 2,
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Produto não encontrado",
      statusCode: 404,
    });
    expect(prismaMock.item.create).not.toHaveBeenCalled();
  });

  it("should fail when the database throws an error.", async () => {
    prismaMock.order.findFirst.mockResolvedValue({ id: "order-id" });
    prismaMock.product.findFirst.mockResolvedValue({
      id: "product-id",
      disabled: false,
    });
    prismaMock.item.create.mockRejectedValue(new Error("DB error"));

    const service = new AddItemOrderService();
    const promise = service.execute({
      orderId: "order-id",
      productId: "product-id",
      amount: 2,
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Falha ao adicionar item no pedido",
      statusCode: 500,
    });
  });
});

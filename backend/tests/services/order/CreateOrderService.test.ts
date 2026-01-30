import { CreateOrderService } from "../../../src/services/order/CreateOrderService";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    order: {
      create: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  order: {
    create: jest.Mock;
  };
};

describe("CreateOrderService", () => {
  beforeEach(() => {
    prismaMock.order.create.mockReset();
  });

  it("should create an order with table and name.", async () => {
    const orderResponse = {
      id: "order-id",
      table: 10,
      name: "Mesa 10",
      status: false,
      draft: true,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    };

    prismaMock.order.create.mockResolvedValue(orderResponse);

    const service = new CreateOrderService();
    const result = await service.execute({ table: 10, name: "Mesa 10" });

    expect(result).toEqual(orderResponse);
    expect(prismaMock.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          table: 10,
          name: "Mesa 10",
        },
        select: {
          id: true,
          table: true,
          name: true,
          status: true,
          draft: true,
          createdAt: true,
        },
      }),
    );
  });

  it("should default name to an empty string when not provided.", async () => {
    const orderResponse = {
      id: "order-id",
      table: 5,
      name: "",
      status: false,
      draft: true,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    };

    prismaMock.order.create.mockResolvedValue(orderResponse);

    const service = new CreateOrderService();
    const result = await service.execute({ table: 5 });

    expect(result).toEqual(orderResponse);
    expect(prismaMock.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          table: 5,
          name: "",
        },
      }),
    );
  });

  it("should propagate database errors.", async () => {
    prismaMock.order.create.mockRejectedValue(new Error("DB error"));

    const service = new CreateOrderService();
    const promise = service.execute({ table: 10, name: "Mesa 10" });

    await expect(promise).rejects.toThrow("DB error");
  });
});

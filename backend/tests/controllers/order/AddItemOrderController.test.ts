import { AddItemController } from "../../../src/controllers/order/AddItemOrderController";
import { AddItemOrderService } from "../../../src/services/order/AddItemOrderService";
import type { Request, Response } from "express";

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

describe("AddItemController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(AddItemOrderService.prototype, "execute")
      .mockResolvedValue(itemResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 201 with the created item.", async () => {
    const controller = new AddItemController();

    const req = {
      body: {
        orderId: "order-id",
        productId: "product-id",
        amount: 2,
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({
      orderId: "order-id",
      productId: "product-id",
      amount: 2,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(itemResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new AddItemController();

    const req = {
      body: {
        orderId: "order-id",
        productId: "product-id",
        amount: 2,
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

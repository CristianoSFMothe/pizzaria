import { CreateOrderController } from "../../../src/controllers/order/CreateOrderController";
import { CreateOrderService } from "../../../src/services/order/CreateOrderService";
import type { Request, Response } from "express";

const orderResponse = {
  id: "order-id",
  table: 10,
  name: "Mesa 10",
  status: false,
  draft: true,
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("CreateOrderController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(CreateOrderService.prototype, "execute")
      .mockResolvedValue(orderResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 201 with the order data.", async () => {
    const controller = new CreateOrderController();

    const req = {
      body: {
        table: "10",
        name: "Mesa 10",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({
      table: 10,
      name: "Mesa 10",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(orderResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new CreateOrderController();

    const req = {
      body: {
        table: "10",
        name: "Mesa 10",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

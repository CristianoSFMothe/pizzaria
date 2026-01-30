import { SendOrderController } from "../../../src/controllers/order/SendOrderController";
import { SendOrderService } from "../../../src/services/order/SendOrderService";
import type { Request, Response } from "express";

const orderResponse = {
  id: "order-id",
  table: 10,
  name: "Mesa 10",
  draft: false,
  status: false,
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("SendOrderController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(SendOrderService.prototype, "execute")
      .mockResolvedValue(orderResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the sent order.", async () => {
    const controller = new SendOrderController();

    const req = {
      body: {
        orderId: "order-id",
        name: "Mesa 10",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({
      orderId: "order-id",
      name: "Mesa 10",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(orderResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new SendOrderController();

    const req = {
      body: {
        orderId: "order-id",
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

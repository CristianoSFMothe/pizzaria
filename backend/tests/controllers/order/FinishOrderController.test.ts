import { FinishOrderController } from "../../../src/controllers/order/FinishOrderController";
import { FinishOrderService } from "../../../src/services/order/FinishOrderService";
import type { Request, Response } from "express";

const orderResponse = {
  id: "order-id",
  table: 10,
  name: "Mesa 10",
  draft: true,
  status: false,
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("FinishOrderController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(FinishOrderService.prototype, "execute")
      .mockResolvedValue(orderResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the finished order.", async () => {
    const controller = new FinishOrderController();

    const req = {
      body: {
        orderId: "order-id",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({ orderId: "order-id" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(orderResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new FinishOrderController();

    const req = {
      body: {
        orderId: "order-id",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

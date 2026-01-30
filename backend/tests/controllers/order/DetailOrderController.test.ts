import { DetailOrderController } from "../../../src/controllers/order/DetailOrderController";
import { DetailOrderService } from "../../../src/services/order/DetailOrderService";
import type { Request, Response } from "express";

const orderResponse = {
  id: "order-id",
  table: 10,
  name: "Mesa 10",
  draft: true,
  status: false,
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  items: [],
};

describe("DetailOrderController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(DetailOrderService.prototype, "execute")
      .mockResolvedValue(orderResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the order details.", async () => {
    const controller = new DetailOrderController();

    const req = {
      query: {
        orderId: "order-id",
      },
    } as unknown as Request;

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

    const controller = new DetailOrderController();

    const req = {
      query: {
        orderId: "order-id",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

import { ListOrdersController } from "../../../src/controllers/order/ListOrdersController";
import { ListOrdersService } from "../../../src/services/order/ListOrdersService";
import type { Request, Response } from "express";

const ordersResponse = [
  {
    id: "order-id",
    table: 10,
    name: "Mesa 10",
    status: false,
    draft: true,
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    items: [],
  },
];

describe("ListOrdersController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(ListOrdersService.prototype, "execute")
      .mockResolvedValue(ordersResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the orders list.", async () => {
    const controller = new ListOrdersController();

    const req = {
      query: {
        draft: "true",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({ draft: "true" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(ordersResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new ListOrdersController();

    const req = {
      query: {
        draft: "false",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

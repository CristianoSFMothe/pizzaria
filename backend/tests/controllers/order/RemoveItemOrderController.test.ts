import { RemoveItemOrderController } from "../../../src/controllers/order/RemoveItemOrderController";
import { RemoveItemOrderService } from "../../../src/services/order/RemoveItemOrderService";
import type { Request, Response } from "express";

const removeResponse = {
  message: "Item removido com sucesso",
};

describe("RemoveItemOrderController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(RemoveItemOrderService.prototype, "execute")
      .mockResolvedValue(removeResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the result message.", async () => {
    const controller = new RemoveItemOrderController();

    const req = {
      query: {
        itemId: "item-id",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({ itemId: "item-id" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(removeResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new RemoveItemOrderController();

    const req = {
      query: {
        itemId: "item-id",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

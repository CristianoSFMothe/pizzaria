import { DeleteProductController } from "../../../src/controllers/product/DeleteProductController";
import { DeleteProductService } from "../../../src/services/product/DeleteProductService";
import type { Request, Response } from "express";

const deleteResponse = {
  message: "Produto deletado com sucesso",
};

describe("DeleteProductController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(DeleteProductService.prototype, "execute")
      .mockResolvedValue(deleteResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the delete message.", async () => {
    const controller = new DeleteProductController();

    const req = {
      query: {
        productId: "product-id",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({ productId: "product-id" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(deleteResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new DeleteProductController();

    const req = {
      query: {
        productId: "product-id",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

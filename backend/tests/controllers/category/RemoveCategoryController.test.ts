import { RemoveCategoryController } from "../../../src/controllers/category/RemoveCategoryController";
import { RemoveCategoryService } from "../../../src/services/category/RemoveCategoryService";
import type { Request, Response } from "express";

const removeResponse = {
  message: "Categoria desativada com sucesso",
};

describe("RemoveCategoryController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(RemoveCategoryService.prototype, "execute")
      .mockResolvedValue(removeResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the result message.", async () => {
    const controller = new RemoveCategoryController();

    const req = {
      query: {
        categoryId: "category-id",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({ categoryId: "category-id" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(removeResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new RemoveCategoryController();

    const req = {
      query: {
        categoryId: "category-id",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

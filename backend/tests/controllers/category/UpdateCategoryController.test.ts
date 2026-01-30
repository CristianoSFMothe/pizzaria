import { UpdateCategoryController } from "../../../src/controllers/category/UpdateCategoryController";
import { UpdateCategoryService } from "../../../src/services/category/UpdateCategoryService";
import type { Request, Response } from "express";

const categoryResponse = {
  id: "category-id",
  name: "Pizza Nova",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-02T00:00:00.000Z"),
};

describe("UpdateCategoryController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(UpdateCategoryService.prototype, "execute")
      .mockResolvedValue(categoryResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the updated category.", async () => {
    const controller = new UpdateCategoryController();

    const req = {
      query: {
        categoryId: "category-id",
      },
      body: {
        name: "Pizza Nova",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({
      categoryId: "category-id",
      name: "Pizza Nova",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(categoryResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new UpdateCategoryController();

    const req = {
      query: {
        categoryId: "category-id",
      },
      body: {
        name: "Pizza Nova",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

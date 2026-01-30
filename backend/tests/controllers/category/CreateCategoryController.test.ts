import { CreateCategoryController } from "../../../src/controllers/category/CreateCategoryController";
import { CreateCategoryService } from "../../../src/services/category/CreateCategoryService";
import type { Request, Response } from "express";

const categoryResponse = {
  id: "category-id",
  name: "Pizzas Doces",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("CreateCategoryController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(CreateCategoryService.prototype, "execute")
      .mockResolvedValue(categoryResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 201 with the category data.", async () => {
    const controller = new CreateCategoryController();

    const req = {
      body: {
        name: "Pizzas Doces",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({ name: "Pizzas Doces" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(categoryResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new CreateCategoryController();

    const req = {
      body: {
        name: "Pizzas Doces",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

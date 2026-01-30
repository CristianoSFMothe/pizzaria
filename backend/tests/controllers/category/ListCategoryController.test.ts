import { ListCategoryController } from "../../../src/controllers/category/ListCategoryController";
import { ListCategoryService } from "../../../src/services/category/ListCategoryService";
import type { Request, Response } from "express";

const categoriesResponse = [
  {
    id: "category-id-1",
    name: "Pizzas Doces",
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    id: "category-id-2",
    name: "Pizzas Salgadas",
    createdAt: new Date("2025-01-02T00:00:00.000Z"),
  },
];

describe("ListCategoryController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(ListCategoryService.prototype, "execute")
      .mockResolvedValue(categoriesResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the categories list.", async () => {
    const controller = new ListCategoryController();

    const req = {} as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(categoriesResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new ListCategoryController();

    const req = {} as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

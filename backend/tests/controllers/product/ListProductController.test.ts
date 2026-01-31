import { ListProductController } from "../../../src/controllers/product/ListProductController";
import { ListProductService } from "../../../src/services/product/ListProductService";
import type { Request, Response } from "express";

const productsResponse = [
  {
    id: "product-id",
    name: "Pizza",
    description: "Descrição",
    price: 10,
    categoryId: "category-id",
    banner: "https://image",
    disabled: false,
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    category: {
      id: "category-id",
      name: "Pizzas",
    },
  },
];

describe("ListProductController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(ListProductService.prototype, "execute")
      .mockResolvedValue(productsResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the products list.", async () => {
    const controller = new ListProductController();

    const req = {
      query: {
        disabled: "true",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({ disabled: "true" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(productsResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new ListProductController();

    const req = {
      query: {
        disabled: "false",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

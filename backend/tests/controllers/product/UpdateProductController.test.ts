import { UpdateProductController } from "../../../src/controllers/product/UpdateProductController";
import { UpdateProductService } from "../../../src/services/product/UpdateProductService";
import type { Request, Response } from "express";

const productResponse = {
  id: "product-id",
  name: "Pizza",
  description: "Descrição",
  price: 10,
  categoryId: "category-id",
  banner: "https://image",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-02T00:00:00.000Z"),
};

describe("UpdateProductController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(UpdateProductService.prototype, "execute")
      .mockResolvedValue(productResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the updated product.", async () => {
    const controller = new UpdateProductController();
    const imageBuffer = Buffer.from("image");

    const req = {
      query: {
        productId: "product-id",
      },
      body: {
        name: "Pizza",
        description: "Descrição",
        price: "10",
      },
      file: {
        originalname: "banner.png",
        buffer: imageBuffer,
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({
      productId: "product-id",
      name: "Pizza",
      description: "Descrição",
      price: 10,
      imageName: "banner.png",
      imageBuffer,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(productResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new UpdateProductController();

    const req = {
      query: {
        productId: "product-id",
      },
      body: {
        name: "Pizza",
        description: "Descrição",
        price: "10",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

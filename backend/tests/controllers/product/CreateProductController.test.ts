import { CreateProductController } from "../../../src/controllers/product/CreateProductController";
import { CreateProductService } from "../../../src/services/product/CreateProductService";
import { AppError } from "../../../src/errors/AppError";
import type { Request, Response } from "express";

const productResponse = {
  id: "product-id",
  name: "Pizza",
  description: "Descrição",
  price: 10,
  categoryId: "category-id",
  banner: "https://image",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("CreateProductController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(CreateProductService.prototype, "execute")
      .mockResolvedValue(productResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 201 with the created product.", async () => {
    const controller = new CreateProductController();
    const imageBuffer = Buffer.from("image");

    const req = {
      body: {
        name: "Pizza",
        description: "Descrição",
        price: "10",
        categoryId: "category-id",
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
      name: "Pizza",
      description: "Descrição",
      price: 10,
      categoryId: "category-id",
      imageName: "banner.png",
      imageBuffer,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(productResponse);
  });

  it("should fail when the image is missing.", async () => {
    const controller = new CreateProductController();

    const req = {
      body: {
        name: "Pizza",
        description: "Descrição",
        price: "10",
        categoryId: "category-id",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const promise = controller.handle(req, res);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Imagem do produto é obrigatória",
      statusCode: 400,
    });
    expect(executeSpy).not.toHaveBeenCalled();
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new CreateProductController();
    const imageBuffer = Buffer.from("image");

    const req = {
      body: {
        name: "Pizza",
        description: "Descrição",
        price: "10",
        categoryId: "category-id",
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

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

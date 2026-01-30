import { PassThrough } from "node:stream";
import { UpdateProductService } from "../../../src/services/product/UpdateProductService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";
import cloudinary from "../../../src/config/cloudinary";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    product: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../../../src/config/cloudinary", () => ({
  __esModule: true,
  default: {
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  product: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
};

const cloudinaryMock = cloudinary as unknown as {
  uploader: {
    upload_stream: jest.Mock;
  };
};

describe("UpdateProductService", () => {
  beforeEach(() => {
    prismaMock.product.findFirst.mockReset();
    prismaMock.product.update.mockReset();
    cloudinaryMock.uploader.upload_stream.mockReset();
  });

  it("should fail when the product does not exist.", async () => {
    prismaMock.product.findFirst.mockResolvedValue(null);

    const service = new UpdateProductService();
    const promise = service.execute({
      productId: "product-id",
      name: "Pizza",
      description: "Descrição",
      price: 10,
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Produto não encontrado",
      statusCode: 404,
    });
    expect(prismaMock.product.update).not.toHaveBeenCalled();
  });

  it("should return the product when no changes are provided.", async () => {
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

    prismaMock.product.findFirst.mockResolvedValue(productResponse);

    const service = new UpdateProductService();
    const result = await service.execute({
      productId: "product-id",
      name: "Pizza",
      description: "Descrição",
      price: 10,
    });

    expect(result).toEqual(productResponse);
    expect(prismaMock.product.update).not.toHaveBeenCalled();
    expect(cloudinaryMock.uploader.upload_stream).not.toHaveBeenCalled();
  });

  it("should update the product when data changes.", async () => {
    const currentProduct = {
      id: "product-id",
      name: "Pizza",
      description: "Descrição",
      price: 10,
      categoryId: "category-id",
      banner: "https://image",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      updatedAt: new Date("2025-01-02T00:00:00.000Z"),
    };

    const updatedProduct = {
      ...currentProduct,
      name: "Pizza Nova",
      description: "Descrição Nova",
      price: 12,
      updatedAt: new Date("2025-01-03T00:00:00.000Z"),
    };

    prismaMock.product.findFirst.mockResolvedValue(currentProduct);
    prismaMock.product.update.mockResolvedValue(updatedProduct);

    const service = new UpdateProductService();
    const result = await service.execute({
      productId: "product-id",
      name: "Pizza Nova",
      description: "Descrição Nova",
      price: 12,
    });

    expect(result).toEqual(updatedProduct);
    expect(prismaMock.product.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "product-id" },
        data: {
          name: "Pizza Nova",
          description: "Descrição Nova",
          price: 12,
          banner: "https://image",
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          categoryId: true,
          banner: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    );
  });

  it("should update the banner when an image is provided.", async () => {
    const currentProduct = {
      id: "product-id",
      name: "Pizza",
      description: "Descrição",
      price: 10,
      categoryId: "category-id",
      banner: "https://image",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      updatedAt: new Date("2025-01-02T00:00:00.000Z"),
    };

    const updatedProduct = {
      ...currentProduct,
      banner: "https://new-image",
      updatedAt: new Date("2025-01-03T00:00:00.000Z"),
    };

    prismaMock.product.findFirst.mockResolvedValue(currentProduct);
    prismaMock.product.update.mockResolvedValue(updatedProduct);

    cloudinaryMock.uploader.upload_stream.mockImplementation((_options, cb) => {
      const stream = new PassThrough();
      process.nextTick(() => cb(null, { secure_url: "https://new-image" }));
      return stream;
    });

    const service = new UpdateProductService();
    const result = await service.execute({
      productId: "product-id",
      name: "Pizza",
      description: "Descrição",
      price: 10,
      imageName: "banner.png",
      imageBuffer: Buffer.from("image"),
    });

    expect(result).toEqual(updatedProduct);
    expect(cloudinaryMock.uploader.upload_stream).toHaveBeenCalled();
    expect(prismaMock.product.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          banner: "https://new-image",
        }),
      }),
    );
  });

  it("should fail when there is a database error.", async () => {
    prismaMock.product.findFirst.mockResolvedValue({
      id: "product-id",
      name: "Pizza",
      description: "Descrição",
      price: 10,
      categoryId: "category-id",
      banner: "https://image",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      updatedAt: new Date("2025-01-02T00:00:00.000Z"),
    });
    prismaMock.product.update.mockRejectedValue(new Error("DB error"));

    const service = new UpdateProductService();
    const promise = service.execute({
      productId: "product-id",
      name: "Pizza Nova",
      description: "Descrição Nova",
      price: 12,
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao atualizar produto",
      statusCode: 500,
    });
  });
});

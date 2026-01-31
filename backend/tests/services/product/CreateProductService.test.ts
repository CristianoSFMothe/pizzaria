import { PassThrough } from "node:stream";
import { CreateProductService } from "../../../src/services/product/CreateProductService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";
import cloudinary from "../../../src/config/cloudinary";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    category: {
      findFirst: jest.fn(),
    },
    product: {
      create: jest.fn(),
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
  category: {
    findFirst: jest.Mock;
  };
  product: {
    create: jest.Mock;
  };
};

const cloudinaryMock = cloudinary as unknown as {
  uploader: {
    upload_stream: jest.Mock;
  };
};

describe("CreateProductService", () => {
  beforeEach(() => {
    prismaMock.category.findFirst.mockReset();
    prismaMock.product.create.mockReset();
    cloudinaryMock.uploader.upload_stream.mockReset();
  });

  it("should fail when the category does not exist.", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null);

    const service = new CreateProductService();
    const promise = service.execute({
      name: "Pizza",
      description: "Descrição",
      price: 10,
      categoryId: "category-id",
      imageName: "banner.png",
      imageBuffer: Buffer.from("image"),
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Categoria não existe",
      statusCode: 404,
    });
    expect(cloudinaryMock.uploader.upload_stream).not.toHaveBeenCalled();
    expect(prismaMock.product.create).not.toHaveBeenCalled();
  });

  it("should fail when the category is inactive.", async () => {
    prismaMock.category.findFirst.mockResolvedValue({
      id: "category-id",
      active: false,
    });

    const service = new CreateProductService();
    const promise = service.execute({
      name: "Pizza",
      description: "Descrição",
      price: 10,
      categoryId: "category-id",
      imageName: "banner.png",
      imageBuffer: Buffer.from("image"),
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Categoria desativada",
      statusCode: 400,
    });
    expect(cloudinaryMock.uploader.upload_stream).not.toHaveBeenCalled();
    expect(prismaMock.product.create).not.toHaveBeenCalled();
  });

  it("should fail when the image upload fails.", async () => {
    prismaMock.category.findFirst.mockResolvedValue({
      id: "category-id",
      active: true,
    });

    cloudinaryMock.uploader.upload_stream.mockImplementation((_options, cb) => {
      const stream = new PassThrough();
      process.nextTick(() => cb(new Error("Upload error")));
      return stream;
    });

    const service = new CreateProductService();
    const promise = service.execute({
      name: "Pizza",
      description: "Descrição",
      price: 10,
      categoryId: "category-id",
      imageName: "banner.png",
      imageBuffer: Buffer.from("image"),
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao enviar imagem do produto",
      statusCode: 500,
    });
    expect(prismaMock.product.create).not.toHaveBeenCalled();
  });

  it("should create a product when data is valid.", async () => {
    const createdProduct = {
      id: "product-id",
      name: "Pizza",
      description: "Descrição",
      price: 10,
      categoryId: "category-id",
      banner: "https://image",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    };

    prismaMock.category.findFirst.mockResolvedValue({
      id: "category-id",
      active: true,
    });

    cloudinaryMock.uploader.upload_stream.mockImplementation((_options, cb) => {
      const stream = new PassThrough();
      process.nextTick(() => cb(null, { secure_url: "https://image" }));
      return stream;
    });

    prismaMock.product.create.mockResolvedValue(createdProduct);

    const service = new CreateProductService();
    const result = await service.execute({
      name: "Pizza",
      description: "Descrição",
      price: 10,
      categoryId: "category-id",
      imageName: "banner.png",
      imageBuffer: Buffer.from("image"),
    });

    expect(result).toEqual(createdProduct);
    expect(cloudinaryMock.uploader.upload_stream).toHaveBeenCalled();

    const uploadOptions = cloudinaryMock.uploader.upload_stream.mock.calls[0][0];
    expect(uploadOptions).toMatchObject({
      folder: "products",
      resource_type: "image",
    });
    expect(uploadOptions.public_id).toEqual(expect.stringContaining("banner"));

    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: {
        name: "Pizza",
        description: "Descrição",
        price: 10,
        categoryId: "category-id",
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
      },
    });
  });
});

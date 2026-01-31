import { ListProductByCategoryService } from "../../../src/services/product/ListProductByCategoryService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    category: {
      findFirst: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  category: {
    findFirst: jest.Mock;
  };
  product: {
    findMany: jest.Mock;
  };
};

describe("ListProductByCategoryService", () => {
  beforeEach(() => {
    prismaMock.category.findFirst.mockReset();
    prismaMock.product.findMany.mockReset();
  });

  it("should fail when the category does not exist.", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null);

    const service = new ListProductByCategoryService();
    const promise = service.execute({ categoryId: "category-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Categoria nao existe",
      statusCode: 404,
    });
    expect(prismaMock.product.findMany).not.toHaveBeenCalled();
  });

  it("should fail when the category is inactive.", async () => {
    prismaMock.category.findFirst.mockResolvedValue({
      id: "category-id",
      active: false,
    });

    const service = new ListProductByCategoryService();
    const promise = service.execute({ categoryId: "category-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Categoria desativada",
      statusCode: 400,
    });
    expect(prismaMock.product.findMany).not.toHaveBeenCalled();
  });

  it("should return the products list when the category is active.", async () => {
    const productsResponse = [
      {
        id: "product-id-1",
        name: "Pizza Calabresa",
        description: "Pizza com calabresa",
        price: 35,
        categoryId: "category-id",
        banner: "https://example.com/pizza.png",
        disabled: false,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        category: {
          id: "category-id",
          name: "Pizzas Salgadas",
        },
      },
    ];

    prismaMock.category.findFirst.mockResolvedValue({
      id: "category-id",
      active: true,
    });
    prismaMock.product.findMany.mockResolvedValue(productsResponse);

    const service = new ListProductByCategoryService();
    const result = await service.execute({ categoryId: "category-id" });

    expect(result).toEqual(productsResponse);
    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: "category-id", disabled: false },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        categoryId: true,
        banner: true,
        disabled: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: "desc" },
    });
  });

  it("should fail when there is a database error.", async () => {
    prismaMock.category.findFirst.mockResolvedValue({
      id: "category-id",
      active: true,
    });
    prismaMock.product.findMany.mockRejectedValue(new Error("DB error"));

    const service = new ListProductByCategoryService();
    const promise = service.execute({ categoryId: "category-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao listar produtos da categoria",
      statusCode: 500,
    });
  });
});

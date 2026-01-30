import { ListProductService } from "../../../src/services/product/ListProductService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  product: {
    findMany: jest.Mock;
  };
};

describe("ListProductService", () => {
  beforeEach(() => {
    prismaMock.product.findMany.mockReset();
  });

  it("should return the products list.", async () => {
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

    prismaMock.product.findMany.mockResolvedValue(productsResponse);

    const service = new ListProductService();
    const result = await service.execute({ disabled: "false" });

    expect(result).toEqual(productsResponse);
    expect(prismaMock.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { disabled: false },
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
      }),
    );
  });

  it("should fail when there is an error in the database.", async () => {
    prismaMock.product.findMany.mockRejectedValue(new Error("DB error"));

    const service = new ListProductService();
    const promise = service.execute({ disabled: "true" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao listar produtos",
      statusCode: 500,
    });
  });
});

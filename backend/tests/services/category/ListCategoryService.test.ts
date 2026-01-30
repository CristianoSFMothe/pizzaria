import { ListCategoryService } from "../../../src/services/category/ListCategoryService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    category: {
      findMany: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  category: {
    findMany: jest.Mock;
  };
};

describe("ListCategoryService", () => {
  beforeEach(() => {
    prismaMock.category.findMany.mockReset();
  });

  it("should return the categories list.", async () => {
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

    prismaMock.category.findMany.mockResolvedValue(categoriesResponse);

    const service = new ListCategoryService();
    const result = await service.execute();

    expect(result).toEqual(categoriesResponse);
    expect(prismaMock.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { active: true },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: { name: "desc" },
      }),
    );
  });

  it("should fail when there is an error in the database.", async () => {
    prismaMock.category.findMany.mockRejectedValue(new Error("DB error"));

    const service = new ListCategoryService();
    const promise = service.execute();

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao listar categorias",
      statusCode: 500,
    });
  });
});

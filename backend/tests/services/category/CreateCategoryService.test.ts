import { CreateCategoryService } from "../../../src/services/category/CreateCategoryService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    category: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  category: {
    findFirst: jest.Mock;
    create: jest.Mock;
  };
};

describe("CreateCategoryService", () => {
  beforeEach(() => {
    prismaMock.category.findFirst.mockReset();
    prismaMock.category.create.mockReset();
  });

  it("should create a category when it does not exist.", async () => {
    const categoryResponse = {
      id: "category-id",
      name: "Pizzas Doces",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    };

    prismaMock.category.findFirst.mockResolvedValue(null);
    prismaMock.category.create.mockResolvedValue(categoryResponse);

    const service = new CreateCategoryService();
    const result = await service.execute({ name: "Pizzas Doces" });

    expect(result).toEqual(categoryResponse);
    expect(prismaMock.category.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: "Pizzas Doces" },
      }),
    );
    expect(prismaMock.category.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "Pizzas Doces" },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
    );
  });

  it("should fail when the category already exists.", async () => {
    prismaMock.category.findFirst.mockResolvedValue({ id: "category-id" });

    const service = new CreateCategoryService();
    const promise = service.execute({ name: "Pizzas Doces" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Categoria ja cadastrada",
      statusCode: 409,
    });
    expect(prismaMock.category.create).not.toHaveBeenCalled();
  });

  it("should fail when the database throws an error.", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null);
    prismaMock.category.create.mockRejectedValue(new Error("DB error"));

    const service = new CreateCategoryService();
    const promise = service.execute({ name: "Pizzas Doces" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao cadastrar categoria",
      statusCode: 400,
    });
  });
});

import { UpdateCategoryService } from "../../../src/services/category/UpdateCategoryService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    category: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  category: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
};

describe("UpdateCategoryService", () => {
  beforeEach(() => {
    prismaMock.category.findFirst.mockReset();
    prismaMock.category.update.mockReset();
  });

  it("should return the category when the name is the same.", async () => {
    const categoryResponse = {
      id: "category-id",
      name: "Pizza",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      updatedAt: new Date("2025-01-02T00:00:00.000Z"),
    };

    prismaMock.category.findFirst.mockResolvedValue(categoryResponse);

    const service = new UpdateCategoryService();
    const result = await service.execute({
      categoryId: "category-id",
      name: "Pizza",
    });

    expect(result).toEqual(categoryResponse);
    expect(prismaMock.category.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.category.update).not.toHaveBeenCalled();
  });

  it("should update the category when the name is different.", async () => {
    const currentCategory = {
      id: "category-id",
      name: "Pizza",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      updatedAt: new Date("2025-01-02T00:00:00.000Z"),
    };

    const updatedCategory = {
      id: "category-id",
      name: "Pizza Nova",
      createdAt: currentCategory.createdAt,
      updatedAt: new Date("2025-01-03T00:00:00.000Z"),
    };

    prismaMock.category.findFirst
      .mockResolvedValueOnce(currentCategory)
      .mockResolvedValueOnce(null);
    prismaMock.category.update.mockResolvedValue(updatedCategory);

    const service = new UpdateCategoryService();
    const result = await service.execute({
      categoryId: "category-id",
      name: "Pizza Nova",
    });

    expect(result).toEqual(updatedCategory);
    expect(prismaMock.category.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "category-id" },
        data: { name: "Pizza Nova" },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    );
  });

  it("should fail when the category does not exist.", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null);

    const service = new UpdateCategoryService();
    const promise = service.execute({
      categoryId: "category-id",
      name: "Pizza Nova",
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Categoria nao encontrada",
      statusCode: 404,
    });
    expect(prismaMock.category.update).not.toHaveBeenCalled();
  });

  it("should fail when another category already has the name.", async () => {
    prismaMock.category.findFirst
      .mockResolvedValueOnce({
        id: "category-id",
        name: "Pizza",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-01-02T00:00:00.000Z"),
      })
      .mockResolvedValueOnce({ id: "other-category" });

    const service = new UpdateCategoryService();
    const promise = service.execute({
      categoryId: "category-id",
      name: "Pizza Nova",
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Categoria ja cadastrada",
      statusCode: 409,
    });
    expect(prismaMock.category.update).not.toHaveBeenCalled();
  });

  it("should fail when there is a database error.", async () => {
    prismaMock.category.findFirst
      .mockResolvedValueOnce({
        id: "category-id",
        name: "Pizza",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-01-02T00:00:00.000Z"),
      })
      .mockResolvedValueOnce(null);
    prismaMock.category.update.mockRejectedValue(new Error("DB error"));

    const service = new UpdateCategoryService();
    const promise = service.execute({
      categoryId: "category-id",
      name: "Pizza Nova",
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao atualizar categoria",
      statusCode: 500,
    });
  });
});

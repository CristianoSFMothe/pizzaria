import { RemoveCategoryService } from "../../../src/services/category/RemoveCategoryService";
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

describe("RemoveCategoryService", () => {
  beforeEach(() => {
    prismaMock.category.findFirst.mockReset();
    prismaMock.category.update.mockReset();
  });

  it("should deactivate a category when it is active.", async () => {
    prismaMock.category.findFirst.mockResolvedValue({
      id: "category-id",
      active: true,
    });
    prismaMock.category.update.mockResolvedValue({});

    const service = new RemoveCategoryService();
    const result = await service.execute({ categoryId: "category-id" });

    expect(result).toEqual({ message: "Categoria desativada com sucesso" });
    expect(prismaMock.category.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "category-id" },
        select: { id: true, active: true },
      }),
    );
    expect(prismaMock.category.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "category-id" },
        data: { active: false },
      }),
    );
  });

  it("should fail when the category does not exist.", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null);

    const service = new RemoveCategoryService();
    const promise = service.execute({ categoryId: "category-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Categoria nao encontrada",
      statusCode: 404,
    });
    expect(prismaMock.category.update).not.toHaveBeenCalled();
  });

  it("should fail when the category is already inactive.", async () => {
    prismaMock.category.findFirst.mockResolvedValue({
      id: "category-id",
      active: false,
    });

    const service = new RemoveCategoryService();
    const promise = service.execute({ categoryId: "category-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Categoria ja desativada",
      statusCode: 400,
    });
    expect(prismaMock.category.update).not.toHaveBeenCalled();
  });

  it("should fail when there is an error in the database.", async () => {
    prismaMock.category.findFirst.mockResolvedValue({
      id: "category-id",
      active: true,
    });
    prismaMock.category.update.mockRejectedValue(new Error("DB error"));

    const service = new RemoveCategoryService();
    const promise = service.execute({ categoryId: "category-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao remover categoria",
      statusCode: 500,
    });
  });
});

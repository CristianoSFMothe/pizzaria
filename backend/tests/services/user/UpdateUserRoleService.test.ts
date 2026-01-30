import { UpdateUserRoleService } from "../../../src/services/user/UpdateUserRoleService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  user: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
};

describe("UpdateUserRoleService", () => {
  beforeEach(() => {
    prismaMock.user.findFirst.mockReset();
    prismaMock.user.update.mockReset();
  });

  it("should update role to ADMIN when user is STAFF.", async () => {
    const userResponse = {
      id: "user-id",
      name: "João",
      email: "joao@example.com",
      role: "ADMIN",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    };

    prismaMock.user.findFirst.mockResolvedValue({
      id: "user-id",
      role: "STAFF",
    });
    prismaMock.user.update.mockResolvedValue(userResponse);

    const service = new UpdateUserRoleService();
    const result = await service.execute({ userId: "user-id" });

    expect(result).toEqual(userResponse);
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-id" },
        select: { id: true, role: true },
      }),
    );
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-id" },
        data: { role: "ADMIN" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    );
  });

  it("should fail when the user does not exist.", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const service = new UpdateUserRoleService();
    const promise = service.execute({ userId: "user-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Usuário não encontrado",
      statusCode: 404,
    });
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should fail when the user is already ADMIN.", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: "user-id",
      role: "ADMIN",
    });

    const service = new UpdateUserRoleService();
    const promise = service.execute({ userId: "user-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Usuário já é ADMIN",
      statusCode: 400,
    });
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should fail when there is a database error.", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: "user-id",
      role: "STAFF",
    });
    prismaMock.user.update.mockRejectedValue(new Error("DB error"));

    const service = new UpdateUserRoleService();
    const promise = service.execute({ userId: "user-id" });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao atualizar role do usuário",
      statusCode: 500,
    });
  });
});

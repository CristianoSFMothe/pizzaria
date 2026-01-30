import { ListUsersService } from "../../../src/services/user/ListUsersService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  user: {
    findMany: jest.Mock;
  };
};

describe("ListUsersService", () => {
  beforeEach(() => {
    prismaMock.user.findMany.mockReset();
  });

  it("should return the users list.", async () => {
    const usersResponse = [
      {
        id: "user-id-1",
        name: "Maria",
        email: "maria@example.com",
        role: "ADMIN",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
      },
      {
        id: "user-id-2",
        name: "João",
        email: "joao@example.com",
        role: "STAFF",
        createdAt: new Date("2025-01-02T00:00:00.000Z"),
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(usersResponse);

    const service = new ListUsersService();
    const result = await service.execute();

    expect(result).toEqual(usersResponse);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          name: "desc",
        },
      }),
    );
  });

  it("should fail when there is an error in the database.", async () => {
    prismaMock.user.findMany.mockRejectedValue(new Error("DB error"));

    const service = new ListUsersService();
    const promise = service.execute();

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Erro ao listar usuários",
      statusCode: 500,
    });
  });
});

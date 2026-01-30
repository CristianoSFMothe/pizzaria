import { DetailsUserService } from "../../../src/services/user/DetailsUserService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
    },
  },
}));

const prismaMock = prismaClient as unknown as {
  user: {
    findFirst: jest.Mock;
  };
};

describe("DetailsUserService", () => {
  beforeEach(() => {
    prismaMock.user.findFirst.mockReset();
  });

  it("should return user data", async () => {
    const userResponse = {
      id: "user-id",
      name: "João",
      email: "joao@example.com",
      role: "STAFF",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    };

    prismaMock.user.findFirst.mockResolvedValue(userResponse);

    const service = new DetailsUserService();
    const result = await service.execute("user-id");

    expect(result).toEqual(userResponse);
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-id" },
      }),
    );
  });

  it("should fail when the user does not exist.", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const service = new DetailsUserService();
    const promise = service.execute("user-id");

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Usuário não encontrado",
      statusCode: 404,
    });
  });

  it("should fail when there is an error in the database.", async () => {
    prismaMock.user.findFirst.mockRejectedValue(new Error("DB error"));

    const service = new DetailsUserService();
    const promise = service.execute("user-id");

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "Usuário não encontrado",
      statusCode: 404,
    });
  });
});

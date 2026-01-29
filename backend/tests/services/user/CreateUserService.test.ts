import { CreateUserService } from "../../../src/services/user/CreateUserService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";
import { hash } from "bcryptjs";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

const prismaMock = prismaClient as unknown as {
  user: {
    findFirst: jest.Mock;
    create: jest.Mock;
  };
};

describe("CreateUserService", () => {
  beforeEach(() => {
    prismaMock.user.findFirst.mockReset();
    prismaMock.user.create.mockReset();
    (hash as jest.Mock).mockReset();
  });

  it("You must register a user when the email address does not exist.", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    (hash as jest.Mock).mockResolvedValue("hashed-password");

    const userResponse = {
      id: "user-id",
      name: "João",
      email: "joao@example.com",
      role: "STAFF",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    };

    prismaMock.user.create.mockResolvedValue(userResponse);

    const service = new CreateUserService();
    const result = await service.execute({
      name: "João",
      email: "joao@example.com",
      password: "123456",
    });

    expect(result).toEqual(userResponse);
    expect(hash).toHaveBeenCalledWith("123456", 10);
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          name: "João",
          email: "joao@example.com",
          password: "hashed-password",
        },
      }),
    );
  });

  it("It should fail when the email is already registered.", async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: "user-id" });

    const service = new CreateUserService();
    const promise = service.execute({
      name: "João",
      email: "joao@example.com",
      password: "123456",
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "E-mail já cadastrado",
      statusCode: 409,
    });
    expect(hash).not.toHaveBeenCalled();
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });
});

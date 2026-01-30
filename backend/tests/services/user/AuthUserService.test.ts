import { AuthUserService } from "../../../src/services/user/AuthUserService";
import { AppError } from "../../../src/errors/AppError";
import prismaClient from "../../../src/prisma/index";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

jest.mock("../../../src/prisma/index", () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const prismaMock = prismaClient as unknown as {
  user: {
    findFirst: jest.Mock;
  };
};

describe("AuthUserService", () => {
  beforeEach(() => {
    prismaMock.user.findFirst.mockReset();
    (compare as jest.Mock).mockReset();
    (sign as jest.Mock).mockReset();
    process.env.JWT_SECRETE = "test-secret";
  });

  it("must authenticate user with valid credentials", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: "user-id",
      name: "João",
      email: "joao@example.com",
      password: "hashed",
      role: "STAFF",
    });
    (compare as jest.Mock).mockResolvedValue(true);
    (sign as jest.Mock).mockReturnValue("jwt-token");

    const service = new AuthUserService();
    const result = await service.execute({
      email: "joao@example.com",
      password: "123456",
    });

    expect(result).toEqual({
      id: "user-id",
      name: "João",
      email: "joao@example.com",
      role: "STAFF",
      token: "jwt-token",
    });
    expect(compare).toHaveBeenCalledWith("123456", "hashed");
    expect(sign).toHaveBeenCalledWith(
      {
        name: "João",
        email: "joao@example.com",
      },
      "test-secret",
      {
        subject: "user-id",
        expiresIn: "30d",
      },
    );
  });

  it("should fail when the email address does not exist.", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const service = new AuthUserService();
    const promise = service.execute({
      email: "joao@example.com",
      password: "123456",
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "E-mail ou senha inválidos",
      statusCode: 401,
    });
    expect(compare).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });

  it("should fail when the password is invalid.", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: "user-id",
      name: "João",
      email: "joao@example.com",
      password: "hashed",
      role: "STAFF",
    });
    (compare as jest.Mock).mockResolvedValue(false);

    const service = new AuthUserService();
    const promise = service.execute({
      email: "joao@example.com",
      password: "123456",
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: "E-mail ou senha inválidos",
      statusCode: 401,
    });
    expect(sign).not.toHaveBeenCalled();
  });
});

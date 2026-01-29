import { CreateUserController } from "../../../src/controllers/user/CreateUserController";
import { CreateUserService } from "../../../src/services/user/CreateUserService";
import type { Request, Response } from "express";

const userResponse = {
  id: "user-id",
  name: "João",
  email: "joao@example.com",
  role: "STAFF",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("CreateUserController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(CreateUserService.prototype, "execute")
      .mockResolvedValue(userResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("It should return 201 with the user's data.", async () => {
    const controller = new CreateUserController();

    const req = {
      body: {
        name: "João",
        email: "joao@example.com",
        password: "123456",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({
      name: "João",
      email: "joao@example.com",
      password: "123456",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(userResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new CreateUserController();

    const req = {
      body: {
        name: "João",
        email: "joao@example.com",
        password: "123456",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

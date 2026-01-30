import { AuthUserController } from "../../../src/controllers/user/AuthUserController";
import { AuthUserService } from "../../../src/services/user/AuthUserService";
import type { Request, Response } from "express";

const sessionResponse = {
  id: "user-id",
  name: "João",
  email: "joao@example.com",
  role: "STAFF",
  token: "jwt-token",
};

describe("AuthUserController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(AuthUserService.prototype, "execute")
      .mockResolvedValue(sessionResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the session", async () => {
    const controller = new AuthUserController();

    const req = {
      body: {
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
      email: "joao@example.com",
      password: "123456",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(sessionResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new AuthUserController();

    const req = {
      body: {
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

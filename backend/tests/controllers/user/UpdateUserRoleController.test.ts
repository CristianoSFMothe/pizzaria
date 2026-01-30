import { UpdateUserRoleController } from "../../../src/controllers/user/UpdateUserRoleController";
import { UpdateUserRoleService } from "../../../src/services/user/UpdateUserRoleService";
import type { Request, Response } from "express";

const userResponse = {
  id: "user-id",
  name: "João",
  email: "joao@example.com",
  role: "ADMIN",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("UpdateUserRoleController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(UpdateUserRoleService.prototype, "execute")
      .mockResolvedValue(userResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the updated user.", async () => {
    const controller = new UpdateUserRoleController();

    const req = {
      body: {
        userId: "user-id",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({ userId: "user-id" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(userResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new UpdateUserRoleController();

    const req = {
      body: {
        userId: "user-id",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

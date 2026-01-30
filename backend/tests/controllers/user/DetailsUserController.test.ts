import { DetailsUserController } from "../../../src/controllers/user/DetailsUserController";
import { DetailsUserService } from "../../../src/services/user/DetailsUserService";
import type { Request, Response } from "express";

const userResponse = {
  id: "user-id",
  name: "João",
  email: "joao@example.com",
  role: "STAFF",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
};

describe("DetailsUserController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(DetailsUserService.prototype, "execute")
      .mockResolvedValue(userResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the user's data.", async () => {
    const controller = new DetailsUserController();

    const req = {
      userId: "user-id",
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith("user-id");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(userResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new DetailsUserController();

    const req = {
      userId: "user-id",
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

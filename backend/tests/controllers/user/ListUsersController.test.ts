import { ListUsersController } from "../../../src/controllers/user/ListUsersController";
import { ListUsersService } from "../../../src/services/user/ListUsersService";
import type { Request, Response } from "express";

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

describe("ListUsersController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest
      .spyOn(ListUsersService.prototype, "execute")
      .mockResolvedValue(usersResponse as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 200 with the users list.", async () => {
    const controller = new ListUsersController();

    const req = {} as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(usersResponse);
  });

  it("should propagate service error", async () => {
    executeSpy.mockRejectedValueOnce(new Error("Falha"));

    const controller = new ListUsersController();

    const req = {} as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.handle(req, res)).rejects.toThrow("Falha");
  });
});

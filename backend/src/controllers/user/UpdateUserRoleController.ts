import { Request, Response } from "express";
import { UpdateUserRoleService } from "../../services/user/UpdateUserRoleService";

class UpdateUserRoleController {
  async handle(req: Request, res: Response) {
    const { userId } = req.body;

    const updateUserRoleService = new UpdateUserRoleService();

    const user = await updateUserRoleService.execute({ userId });

    return res.status(200).json(user);
  }
}

export { UpdateUserRoleController };

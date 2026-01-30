import { Request, Response } from "express";
import { UpdateCategoryService } from "../../services/category/UpdateCategoryService";

class UpdateCategoryController {
  async handle(req: Request, res: Response) {
    const categoryId = req.query?.categoryId as string;
    const { name } = req.body;

    const updateCategoryService = new UpdateCategoryService();

    const category = await updateCategoryService.execute({ categoryId, name });

    return res.status(200).json(category);
  }
}

export { UpdateCategoryController };

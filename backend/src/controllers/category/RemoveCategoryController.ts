import { Request, Response } from "express";
import { RemoveCategoryService } from "../../services/category/RemoveCategoryService";

class RemoveCategoryController {
  async handle(req: Request, res: Response) {
    const categoryId = req.query?.categoryId as string;

    const removeCategoryService = new RemoveCategoryService();

    const result = await removeCategoryService.execute({ categoryId });

    return res.status(200).json(result);
  }
}

export { RemoveCategoryController };

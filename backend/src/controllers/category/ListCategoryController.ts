import { Request, Response } from "express";
import { ListCategoryService } from "../../services/category/ListCategoryService";

class ListCategoryController {
  async handle(_: Request, res: Response) {
    const listCategoryService = new ListCategoryService();

    const categories = await listCategoryService.execute();

    return res.status(200).json(categories);
  }
}

export { ListCategoryController };

import { Request, Response } from "express";
import { ListProductByCategoryService } from "../../services/product/ListProductByCategoryService";

class ListProductByCategoryController {
  async handle(req: Request, res: Response) {
    const categoryId = req.query.categoryId as string;

    const listProductByCategoryService = new ListProductByCategoryService();

    const products = await listProductByCategoryService.execute({
      categoryId,
    });

    return res.status(200).json(products);
  }
}

export { ListProductByCategoryController };

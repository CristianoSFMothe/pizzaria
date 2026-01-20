import { Request, Response } from "express";
import { ListProductService } from "../../services/product/ListProductService";

class ListProductController {
  async handle(req: Request, res: Response) {
    const disabled = req.query.disabled as string | undefined;

    const listProductService = new ListProductService();

    const products = await listProductService.execute({
      disabled,
    });

    return res.status(200).json(products);
  }
}

export { ListProductController };

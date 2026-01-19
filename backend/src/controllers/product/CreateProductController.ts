import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";
import { AppError } from "../../errors/AppError";

class CreateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, categoryId } = req.body;

    if (!req.file) {
      throw new AppError("Imagem do produto é obrigatória", 400);
    }

    const createProductService = new CreateProductService();

    const product = await createProductService.execute({
      name,
      price: parseInt(price),
      description,
      categoryId,
      imageName: req.file.originalname,
      imageBuffer: req.file.buffer,
    });

    return res.status(201).json(product);
  }
}

export { CreateProductController };

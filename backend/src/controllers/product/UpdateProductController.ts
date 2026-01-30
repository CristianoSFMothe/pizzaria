import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";
import { AppError } from "../../errors/AppError";

class UpdateProductController {
  async handle(req: Request, res: Response) {
    const productId = req.query?.productId as string;
    const { name, price, description } = req.body;

    const imageFile = req.file;
    if (imageFile && !imageFile.buffer) {
      throw new AppError("Imagem do produto inválida", 400);
    }

    const updateProductService = new UpdateProductService();

    const product = await updateProductService.execute({
      productId,
      name,
      price: parseInt(price),
      description,
      imageName: imageFile?.originalname,
      imageBuffer: imageFile?.buffer,
    });

    return res.status(200).json(product);
  }
}

export { UpdateProductController };

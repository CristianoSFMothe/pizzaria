import { Readable } from "node:stream";
import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";
import cloudinary from "../../config/cloudinary";

interface CreateProductServiceProps {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageName: string;
  imageBuffer: Buffer;
}

class CreateProductService {
  async execute({
    name,
    description,
    price,
    categoryId,
    imageName,
    imageBuffer,
  }: CreateProductServiceProps) {
    const categoryExists = await prismaClient.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new AppError("Categoria não existe", 404);
    }

    let bannerUrl = "";

    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            public_id: `${Date.now()}-${imageName.split(".")[0]}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        const bufferStream = Readable.from(imageBuffer);
        bufferStream.pipe(uploadStream);
      });

      bannerUrl = result.secure_url;
    } catch (error) {
      console.log("Error: ", error);
      throw new AppError("Erro ao enviar imagem do produto", 500);
    }

    const product = await prismaClient.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        banner: bannerUrl,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        categoryId: true,
        banner: true,
        createdAt: true,
      },
    });

    return product;
  }
}

export { CreateProductService };

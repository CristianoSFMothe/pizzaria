import { Readable } from "node:stream";
import { AppError } from "../../errors/AppError";
import prismaClient from "../../prisma/index";
import cloudinary from "../../config/cloudinary";

interface UpdateProductServiceProps {
  productId: string;
  name: string;
  description: string;
  price: number;
  imageName?: string;
  imageBuffer?: Buffer;
}

class UpdateProductService {
  async execute({
    productId,
    name,
    description,
    price,
    imageName,
    imageBuffer,
  }: UpdateProductServiceProps) {
    const product = await prismaClient.product.findFirst({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        categoryId: true,
        banner: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    const isSameName = product.name === name;
    const isSameDescription = product.description === description;
    const isSamePrice = product.price === price;

    if (isSameName && isSameDescription && isSamePrice && !imageBuffer) {
      return product;
    }

    let bannerUrl = product.banner;

    if (imageBuffer && imageName) {
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
        throw new AppError("Erro ao enviar imagem do produto", 500);
      }
    }

    try {
      const updatedProduct = await prismaClient.product.update({
        where: {
          id: productId,
        },
        data: {
          name,
          description,
          price,
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
          updatedAt: true,
        },
      });

      return updatedProduct;
    } catch (error) {
      throw new AppError("Erro ao atualizar produto", 500);
    }
  }
}

export { UpdateProductService };

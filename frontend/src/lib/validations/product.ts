import { z } from "zod";

export const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome do produto é obrigatório"),
  price: z
    .string()
    .min(1, "Preço é obrigatório")
    .refine((value) => {
      const numbers = value.replace(/\D/g, "");
      return Boolean(numbers) && Number(numbers) > 0;
    }, "Preço deve ser maior que zero"),
  description: z
    .string()
    .trim()
    .min(1, "Descrição é obrigatória"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  imageFile: z
    .custom<File>(
      (file) => (typeof File === "undefined" ? true : file instanceof File),
      "Imagem do produto é obrigatória",
    )
    .refine((file) => {
      if (typeof File === "undefined" || !(file instanceof File)) return true;
      return file.size <= MAX_PRODUCT_IMAGE_SIZE;
    }, "Imagem deve ter no máximo 5MB")
    .refine((file) => {
      if (typeof File === "undefined" || !(file instanceof File)) return true;
      return PRODUCT_IMAGE_TYPES.includes(file.type);
    }, "Formato de imagem inválido"),
});

export type ProductSchema = z.infer<typeof productSchema>;

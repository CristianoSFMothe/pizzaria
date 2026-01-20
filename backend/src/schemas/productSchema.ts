import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "O nome do produto deve ser um texto" })
      .min(1, "O nome do produto é obrigatório"),
    price: z.string().min(1, "O preço do produto é obrigatório").regex(/^\d+$/),
    description: z
      .string({ message: "A descrição do produto deve ser um texto" })
      .min(1, "A descrição do produto é obrigatória"),
    categoryId: z.string({ message: "O ID da categoria é obrigatório" }),
  }),
});

export const listProductSchema = z.object({
  query: z.object({
    disabled: z
      .string({
        message: "O parâmetro disabled deve ser 'true' ou 'false'",
      })
      .optional(),
  }),
});

export const listProductByCategorySchema = z.object({
  query: z.object({
    categoryId: z.string({ message: "O ID da categoria é obrigatório" }),
  }),
});

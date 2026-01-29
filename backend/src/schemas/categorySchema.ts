import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Categoria precisa ser um texto" })
      .min(3, { message: "Nome de categoria precisa ter 2 caracteres" }),
  }),
});

export const removeCategorySchema = z.object({
  query: z.object({
    categoryId: z
      .string({ message: "O ID da categoria deve ser um texto" })
      .min(1, { message: "O ID da categoria é obrigatório" }),
  }),
});

import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Categoria precisa ser um texto" })
      .min(3, { message: "Nome de categoria precisa ter 2 caracteres" }),
  }),
});

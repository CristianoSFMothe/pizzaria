import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number({ message: "A mesa deve ser um numero" })
      .int("A mesa deve ser um numero inteiro")
      .min(1, "A mesa e obrigatória")
      .positive("A mesa deve ser um numero positivo"),
    name: z.string({ message: "O nome deve ser um texto" }).optional(),
  }),
});

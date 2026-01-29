import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome da categoria é obrigatório"),
});

export type CategorySchema = z.infer<typeof categorySchema>;

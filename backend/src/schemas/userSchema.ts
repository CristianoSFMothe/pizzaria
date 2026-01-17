import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "O nome inválido." })
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres." })
      .max(100, { message: "O nome deve ter no máximo 100 caracteres." }),
    email: z.email({ message: "O email é inválido." }),
    password: z
      .string({ message: "A senha é inválida." })
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres." })
      .max(100, { message: "A senha deve ter no máximo 100 caracteres." }),
  }),
});

export const authUserSchema = z.object({
  body: z.object({
    email: z.email({ message: "Precisa ser um email válido." }).min(1, {
      message: "O e-mail é obrigatório.",
    }),
    password: z.string({ message: "A senha é obrigatória." }).min(1, {
      message: "A senha é obrigatória.",
    }),
  }),
});

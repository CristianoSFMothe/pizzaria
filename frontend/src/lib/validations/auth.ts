import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(3, "Senha deve ter no mínimo 3 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(3, "Senha deve ter no mínimo 3 caracteres"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

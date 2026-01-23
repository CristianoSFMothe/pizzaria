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

export const addItemSchema = z.object({
  body: z.object({
    orderId: z
      .string({ message: "O ID do pedido deve ser um texto" })
      .min(1, "O ID do pedido é obrigatório"),
    productId: z
      .string({ message: "O ID do produto deve ser um texto" })
      .min(1, "O ID do produto é obrigatório"),
    amount: z
      .number()
      .int("A quantidade deve ser um numero inteiro")
      .positive("A quantidade deve ser um numero positivo"),
  }),
});

export const removeItemSchema = z.object({
  query: z.object({
    itemId: z
      .string({ message: "O ID do item deve ser um string" })
      .min(1, "O ID do item e obrigatório"),
  }),
});

export const detailOrderSchema = z.object({
  query: z.object({
    orderId: z
      .string({ message: "Order ID deve ser uma string" })
      .min(1, "O orderId é obrigatório"),
  }),
});

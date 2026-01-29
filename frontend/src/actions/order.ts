"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const finishOrderAction = async (orderId: string) => {
  const token = await getToken();

  if (!orderId) {
    return { success: false, error: "Erro ao finalizar pedido" };
  }

  try {
    if (!token) {
      return { success: false, error: "Erro ao finalizar pedido" };
    }

    const data = {
      orderId: orderId,
    };

    await apiClient("/order/finish", {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });

    revalidatePath("/dashboard");

    return { success: true, error: "" };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Erro ao finalizar pedido" };
  }
};

"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { User } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const updateUserRoleAction = async (userId: string) => {
  if (!userId) {
    return { success: false, error: "Erro ao atualizar usuário" };
  }

  try {
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Usuário não autenticado" };
    }

    const response = await apiClient<User>("/users/role", {
      method: "PUT",
      body: JSON.stringify({ userId }),
      token,
    });

    revalidatePath("/dashboard/users");

    return { success: true, error: "", user: response };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Erro ao atualizar usuário" };
  }
};

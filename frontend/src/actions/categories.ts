"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Categories } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const createCategoryAction = async (formData: FormData) => {
  try {
    const token = await getToken();
    const name = formData.get("name") as string;

    await apiClient<Categories>("/category", {
      method: "POST",
      body: JSON.stringify({ name }),
      token,
    });

    revalidatePath("/dashboard/categories");

    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro ao cadastrar categoria" };
  }
};

export const updateCategoryAction = async (categoryId: string, name: string) => {
  try {
    if (!categoryId) {
      return { success: false, error: "Erro ao atualizar categoria" };
    }

    const token = await getToken();

    if (!token) {
      return { success: false, error: "Erro ao atualizar categoria" };
    }

    await apiClient<Categories>(`/category/update?categoryId=${categoryId}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
      token,
    });

    revalidatePath("/dashboard/categories");

    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro ao atualizar categoria" };
  }
};

export const deleteCategoryAction = async (categoryId: string) => {
  try {
    if (!categoryId) {
      return { success: false, error: "Erro ao excluir categoria" };
    }

    const token = await getToken();

    if (!token) {
      return { success: false, error: "Erro ao excluir categoria" };
    }

    await apiClient(`/category/remove?categoryId=${categoryId}`, {
      method: "DELETE",
      token,
    });

    revalidatePath("/dashboard/categories");

    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro ao excluir categoria" };
  }
};

"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const createProductAction = async (formData: FormData) => {
  try {
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Erro ao criar produto" };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Erro ao criar produto" };
    }

    await response.json();

    revalidatePath("/dashboard/products");

    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Erro ao criar produto" };
  }
};

export const deleteProductAction = async (productId: string) => {
  try {
    if (!productId) {
      return { success: false, error: "Erro ao deletar produto" };
    }
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Erro ao deletar produto" };
    }
    await apiClient(`/product?productId=${productId}`, {
      method: "DELETE",
      token,
    });

    revalidatePath("/dashboard/products");

    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro ao deletar produto" };
  }
};

export const updateProductAction = async (
  productId: string,
  formData: FormData,
) => {
  try {
    if (!productId) {
      return { success: false, error: "Erro ao atualizar produto" };
    }

    const token = await getToken();

    if (!token) {
      return { success: false, error: "Erro ao atualizar produto" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/update?productId=${productId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Erro ao atualizar produto",
      };
    }

    await response.json();

    revalidatePath("/dashboard/products");

    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro ao atualizar produto" };
  }
};

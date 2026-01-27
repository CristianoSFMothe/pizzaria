"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Categories } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const createCategoryAction = async (formData: FormData) => {
  const name = formData.get("name") as string;

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
    return { success: false, error: "Error ao criar categoria" };
  }
};

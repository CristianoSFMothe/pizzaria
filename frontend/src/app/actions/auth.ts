"use server";

import { apiClient } from "@/lib/api";
import { AutResponse, User } from "@/lib/types";

export const registerAction = async (
  prevState: { success: boolean; error: string; redirectTo?: string } | null,
  formData: FormData,
) => {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const data = {
      name,
      email,
      password,
    };

    await apiClient<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return { success: true, error: "", redirectTo: "/login" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: "Error ao criar conta" };
  }
};

export const loginAction = async (
  prevState: { success: boolean; error: string; redirectTo?: string } | null,
  formData: FormData,
) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const data = {
      email,
      password,
    };

    const response = await apiClient<AutResponse>("/session", {
      method: "POST",
      body: JSON.stringify(data),
    });

    console.log("Login successful:", response);

    return { success: true, error: "", redirectTo: "/dashboard" };
  } catch (error) {
    console.error("Login failed:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message || "Error ao fazer login" };
    }
    return { success: false, error: "Error ao fazer login" };
  }
};

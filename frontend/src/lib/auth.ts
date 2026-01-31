import { cookies } from "next/headers";
import { apiClient } from "./api";
import { User } from "./types";
import { redirect } from "next/navigation";

const COOKIE_NAME = "token_pizzaria";

export const getToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
};

export const setToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const removeToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
};

export const getUser = async (): Promise<User | null> => {
  try {
    const token = await getToken();

    if (!token) return null;

    const user = await apiClient<User>("/me", {
      token,
    });

    return user;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

export const requiredAdmin = async (): Promise<User> => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user?.role !== "ADMIN" && user?.role !== "MASTER") {
    redirect("/access-denied");
  }

  return user;
};

export const requiredMaster = async (): Promise<User> => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user?.role !== "MASTER") {
    redirect("/access-denied");
  }

  return user;
};

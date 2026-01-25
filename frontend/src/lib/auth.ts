import { cookies } from "next/headers";

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

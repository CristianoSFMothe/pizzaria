"use server";

export const registerAction = async (
  prevState: { success: boolean; error: string } | null,
  formData: FormData,
) => {
  console.log("Register action");
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log({ name, email, password });

  return { success: true, error: "" };
};

import { RegisterForm } from "@/components/forms/register-form";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const Register = async () => {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="bg-app-background flex min-h-screen items-center justify-center px-4 py-8">
      <Toaster />
      <div className="w-full">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;

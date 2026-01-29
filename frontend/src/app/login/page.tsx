import { LoginForm } from "@/components/forms/login-form";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const Login = async () => {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="bg-app-background flex min-h-screen items-center justify-center px-4 py-8">
      <Toaster />
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

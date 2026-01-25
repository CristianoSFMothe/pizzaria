import { LoginForm } from "@/components/forms/login-form";

const Login = () => {
  return (
    <div className="bg-app-background flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

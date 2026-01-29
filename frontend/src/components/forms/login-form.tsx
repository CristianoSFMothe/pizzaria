"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useActionState, useEffect, useState, type FormEvent } from "react";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validations/auth";

export const LoginForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state, router]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    setFieldErrors({});
    formAction(formData);
  };

  const handleFieldChange =
    (field: "email" | "password") => () => {
      if (!fieldErrors[field]) return;
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <Card className="bg-app-card border-app-border mx-auto w-full max-w-md border">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-white sm:text-4xl">
          Pizzaria <span className="text-brand-primary">Millennium</span>
        </CardTitle>
        <CardDescription className="text-center">
          Preencha os dados para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Informe seu e-mail"
              onChange={handleFieldChange("email")}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={
                fieldErrors.email ? "login-email-error" : undefined
              }
              className="bg-app-background border-app-border border text-white"
            />
            {fieldErrors.email && (
              <p id="login-email-error" className="text-xs text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Informe sua senha"
              onChange={handleFieldChange("password")}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "login-password-error" : undefined
              }
              className="bg-app-background border-app-border border text-white"
            />
            {fieldErrors.password && (
              <p id="login-password-error" className="text-xs text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/90 w-full text-white"
          >
            {isPending ? "Acessando conta..." : "Acessar"}
          </Button>

          <p className="text-center text-sm text-gray-100">
            Ainda não possui uma conta?{" "}
            <Link href="/register" className="text-brand-primary font-semibold">
              Cadastre-se
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

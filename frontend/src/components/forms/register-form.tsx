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
import { registerAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerSchema } from "@/lib/validations/auth";

export const RegisterForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success("Conta criada com sucesso");
      if (state.redirectTo) {
        const timer = setTimeout(() => {
          router.replace(state.redirectTo);
        }, 1200);

        return () => clearTimeout(timer);
      }
      return;
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    const result = registerSchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      setFieldErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    setFieldErrors({});
    formAction(formData);
  };

  const handleFieldChange =
    (field: "name" | "email" | "password") => () => {
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
          Preencha os dados para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nome
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Informe seu nome"
              onChange={handleFieldChange("name")}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={
                fieldErrors.name ? "register-name-error" : undefined
              }
              className="bg-app-background border-app-border border text-white"
            />
            {fieldErrors.name && (
              <p id="register-name-error" className="text-xs text-red-400">
                {fieldErrors.name}
              </p>
            )}
          </div>

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
                fieldErrors.email ? "register-email-error" : undefined
              }
              className="bg-app-background border-app-border border text-white"
            />
            {fieldErrors.email && (
              <p id="register-email-error" className="text-xs text-red-400">
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
                fieldErrors.password ? "register-password-error" : undefined
              }
              className="bg-app-background border-app-border border text-white"
            />
            {fieldErrors.password && (
              <p id="register-password-error" className="text-xs text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/90 w-full text-white"
          >
            {isPending ? "Cadastrando..." : "Criar Conta"}
          </Button>

          <p className="text-center text-sm text-gray-100">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-brand-primary font-semibold">
              Faça o login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

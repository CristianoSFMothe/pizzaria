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
import { useActionState, useEffect } from "react";
import { loginAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state, router]);

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
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Informe seu e-mail"
              required
              className="bg-app-background border-app-border border text-white"
            />
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
              required
              minLength={3}
              className="bg-app-background border-app-border border text-white"
            />
          </div>

          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/90 w-full cursor-pointer text-white"
          >
            {isPending ? "Acessando conta..." : "Acessar"}
          </Button>

          {state?.error && (
            <div className="message-error rounded-md bg-red-50 p-3 text-center text-sm text-red-500">
              {state.error}
            </div>
          )}

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

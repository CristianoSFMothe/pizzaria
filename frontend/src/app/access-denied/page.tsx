import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccessDenied() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <div className="bg-app-background flex min-h-screen items-center justify-center p-4">
      <Card className="bg-app-card border-app-border w-full max-w-md text-white">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <ShieldX className="text-brand-primary h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold">Acesso Negado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-center text-gray-300">
            Você não tem permissão para acessar o painel administrativo.
          </CardDescription>
          <p className="text-center text-sm text-gray-400">
            Se você acredita que isso é um erro, por favor, consulte o
            responsável pelo sistema.
          </p>
          <form action={logoutAction} className="flex justify-center pt-2">
            <Button
              type="submit"
              variant="destructive"
              className="border-app-border w-full text-white"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import clsx from "clsx";
import { ShoppingCart, Package, Tags, LogOut, Menu, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/auth";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";

const menuItems = [
  { title: "Pedidos", href: "/dashboard", icon: ShoppingCart },
  { title: "Produtos", href: "/dashboard/products", icon: Package },
  { title: "Categorias", href: "/dashboard/categories", icon: Tags },
  { title: "Usuários", href: "/dashboard/users", icon: Users, onlyMaster: true },
];

interface MobileSidebarProps {
  userRole: User["role"];
}

const MobileSidebar = ({ userRole }: MobileSidebarProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const filteredMenuItems = menuItems.filter(
    (menu) => !menu.onlyMaster || userRole === "MASTER",
  );

  return (
    <div className="lg:hidden">
      <header className="bg-app-card border-app-card sticky top-0 z-50 border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="" variant="ghost" size={"icon"}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-app-sidebar border-app-border w-72 p-0"
            >
              <SheetHeader className="border-app-border border-b p-6">
                <SheetTitle className="text-xl font-bold text-white">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col space-y-4 p-4">
                {filteredMenuItems.map((menu) => {
                  const Icon = menu.icon;

                  const isActive = pathname === menu.href;
                  return (
                    <Link
                      key={menu.title}
                      href={menu.href}
                      className={clsx(
                        "flex items-center gap-3 rounded-md px-3 text-white",
                        "py-2 text-sm font-medium transition-colors duration-300",
                        isActive ? "bg-brand-primary" : "hover:bg-gray-600",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {menu.title}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-app-border absolute bottom-0 w-full border-t p-4 text-white">
                <form action={logoutAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className={cn(
                      "hover:bg-brand-primary w-full justify-start gap-3",
                      "transition-colors duration-300 hover:text-white",
                    )}
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold text-white">
            Pizzaria <span className="text-brand-primary">Millennium</span>
          </h1>

          <div className="w-10"></div>
        </div>
      </header>
    </div>
  );
};

export default MobileSidebar;

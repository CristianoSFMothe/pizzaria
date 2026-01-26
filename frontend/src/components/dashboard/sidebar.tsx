"use client";

import clsx from "clsx";
import { ShoppingCart, Package, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userName: string;
}

const menuItems = [
  { title: "Pedidos", href: "/dashboard", icon: ShoppingCart },
  { title: "Produtos", href: "/dashboard/products", icon: Package },
  { title: "Categorias", href: "/dashboard/categories", icon: Tags },
];

const Sidebar = ({ userName }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="border-app-border bg-app-background hidden h-screen w-64 flex-col border-r lg:flex">
      <div className="border-app-border border-b p-6">
        <h2 className="text-xl font-bold text-white">
          Pizzaria <span className="text-brand-primary">Millennium</span>
        </h2>

        <p className="mt-1 text-sm text-gray-300">Olá, {userName}</p>
      </div>

      <nav className="flex-1 space-y-4 p-4">
        {menuItems.map((menu) => {
          const Icon = menu.icon;

          const isActive = pathname === menu.href;
          return (
            <Link
              key={menu.title}
              href={menu.href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3",
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
    </aside>
  );
};

export default Sidebar;

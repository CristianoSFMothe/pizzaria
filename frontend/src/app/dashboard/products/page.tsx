import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Package } from "lucide-react";
import { ProductForm } from "@/components/dashboard/product-form";
import Image from "next/image";
import { Categories, Product } from "@/lib/types";

export default async function Products() {
  const token = await getToken();

  // Buscar categorias para o formulário
  const categories = await apiClient<Categories[]>("/category", {
    token: token!,
  });

  // Buscar produtos
  const products = await apiClient<Product[]>("/product", {
    token: token!,
  });

  // Função para formatar o preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Produtos
          </h1>
          <p className="mt-1 text-sm sm:text-base">Gerencie seus produtos</p>
        </div>

        <ProductForm categories={categories} />
      </div>

      {products.length !== 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-app-card border-app-border overflow-hidden text-white transition-shadow hover:shadow-md"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={product.banner}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Package className="h-5 w-5" />
                  <span>{product.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="line-clamp-2 text-sm text-gray-300">
                  {product.description}
                </p>
                <div className="border-app-border flex items-center justify-between border-t pt-2">
                  <span className="text-brand-primary text-lg font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.category && (
                    <span className="bg-app-background rounded px-2 py-1 text-xs">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {products.length === 0 && (
        <div className="py-12 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-500" />
          <p className="text-lg text-gray-400">Nenhum produto cadastrado</p>
          <p className="mt-2 text-sm text-gray-500">
            Comece adicionando seu primeiro produto
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Package } from "lucide-react";

import DeleteButtonProduct from "@/components/dashboard/delete-button";
import ProductImageModal from "@/components/dashboard/product-image-modal";
import { ProductForm } from "@/components/dashboard/product-form";
import UpdateProductModal from "@/components/dashboard/update-product-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Categories, Product } from "@/lib/types";

interface ProductsPageContentProps {
  categories: Categories[];
  products: Product[];
  canManageProducts: boolean;
}

const ProductsPageContent = ({
  categories,
  products,
  canManageProducts,
}: ProductsPageContentProps) => {
  const shouldReduceMotion = useReducedMotion();

  const containerInitial = shouldReduceMotion ? false : { opacity: 0 };
  const containerAnimate = { opacity: 1 };
  const containerTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] };

  const cardInitial = shouldReduceMotion ? false : { opacity: 0, x: -28 };
  const cardAnimate = { opacity: 1, x: 0 };
  const getCardTransition = (index: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : {
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.12 + index * 0.08,
        };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  };

  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      initial={containerInitial}
      animate={containerAnimate}
      transition={containerTransition}
    >
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
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={cardInitial}
              animate={cardAnimate}
              transition={getCardTransition(index)}
            >
              <Card className="bg-app-card border-app-border overflow-hidden text-white transition-shadow hover:shadow-md">
                <ProductImageModal src={product.banner} alt={product.name} />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2 text-base md:text-lg">
                    <div className="flex flex-row items-center gap-2">
                      <Package className="h-5 w-5" />
                      <span>{product.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {canManageProducts && (
                        <UpdateProductModal
                          product={product}
                          categories={categories}
                        />
                      )}
                      <DeleteButtonProduct productId={product.id} />
                    </div>
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
            </motion.div>
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
    </motion.div>
  );
};

export default ProductsPageContent;

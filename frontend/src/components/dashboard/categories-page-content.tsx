"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Tags } from "lucide-react";

import CategoryForm from "@/components/dashboard/category-form";
import CategoriesRefreshButton from "@/components/dashboard/categories-refresh-button";
import DeleteCategoryButton from "@/components/dashboard/delete-category-button";
import UpdateCategoryModal from "@/components/dashboard/update-category-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Categories } from "@/lib/types";

interface CategoriesPageContentProps {
  categories: Categories[];
  canManageCategories: boolean;
}

const CategoriesPageContent = ({
  categories,
  canManageCategories,
}: CategoriesPageContentProps) => {
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

  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      initial={containerInitial}
      animate={containerAnimate}
      transition={containerTransition}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl text-white sm:text-3xl">Categories</h1>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Criei e organize as categorias dos seus produtos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CategoryForm />
          <CategoriesRefreshButton />
        </div>
      </div>

      {categories.length !== 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={cardInitial}
              animate={cardAnimate}
              transition={getCardTransition(index)}
            >
              <Card className="bg-app-card border-app-border text-white transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2 text-base md:text-lg">
                    <div className="flex items-center gap-2">
                      <Tags className="h-5 w-5" />
                      {category.name}
                    </div>
                    {canManageCategories && (
                      <div className="flex items-center gap-2">
                        <UpdateCategoryModal category={category} />
                        <DeleteCategoryButton
                          categoryId={category.id}
                          categoryName={category.name}
                        />
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200">{category.id}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CategoriesPageContent;

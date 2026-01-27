import CategoryForm from "@/components/dashboard/category-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Categories } from "@/lib/types";
import { Tags } from "lucide-react";

const PageCategories = async () => {
  const token = await getToken();
  const categories = await apiClient<Categories[]>("/category", {
    token: token!,
  });
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl text-white sm:text-3xl">Categories</h1>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Criei e organize as categorias dos seus produtos
          </p>
        </div>

        <CategoryForm />
      </div>

      {categories.length !== 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="bg-app-card border-app-border text-white transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Tags className="h-5 w-5" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-200">{category.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageCategories;

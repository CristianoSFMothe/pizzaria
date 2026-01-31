import ProductsPageContent from "@/components/dashboard/products-page-content";
import { apiClient } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";
import { Categories, Product } from "@/lib/types";

export default async function Products() {
  const token = await getToken();
  const currentUser = await getUser();
  const canManageProducts =
    currentUser?.role === "ADMIN" || currentUser?.role === "MASTER";

  const categories = await apiClient<Categories[]>("/category", {
    token: token!,
  });

  const products = await apiClient<Product[]>("/product", {
    token: token!,
  });

  return (
    <ProductsPageContent
      categories={categories}
      products={products}
      canManageProducts={canManageProducts}
    />
  );
}

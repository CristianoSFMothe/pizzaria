import CategoriesPageContent from "@/components/dashboard/categories-page-content";
import { apiClient } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";
import { Categories } from "@/lib/types";
const PageCategories = async () => {
  const token = await getToken();
  const currentUser = await getUser();
  const canManageCategories =
    currentUser?.role === "ADMIN" || currentUser?.role === "MASTER";
  const categories = await apiClient<Categories[]>("/category", {
    token: token!,
    cache: "no-store",
  });
  return (
    <CategoriesPageContent
      categories={categories}
      canManageCategories={canManageCategories}
    />
  );
};

export default PageCategories;

import { requiredAdmin } from "@/lib/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await requiredAdmin();
  return <div>{children}</div>;
};

export default DashboardLayout;

import Sidebar from "@/components/dashboard/sidebar";
import { requiredAdmin } from "@/lib/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await requiredAdmin();
  return (
    <div className="flex h-screen overflow-hidden text-white">
      <Sidebar userName={user.name} />
      {children}
    </div>
  );
};

export default DashboardLayout;

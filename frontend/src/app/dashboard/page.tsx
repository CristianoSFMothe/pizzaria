import Orders from "@/components/dashboard/orders";
import { getToken } from "@/lib/auth";

const PageDashboard = async () => {
  const token = await getToken();

  return <Orders token={token!} />;
};

export default PageDashboard;

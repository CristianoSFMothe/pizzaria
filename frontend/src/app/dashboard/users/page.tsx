import UsersPageContent from "@/components/dashboard/users-page-content";
import { apiClient } from "@/lib/api";
import { getToken, requiredMaster } from "@/lib/auth";
import { User } from "@/lib/types";

const PageUsers = async () => {
  const currentUser = await requiredMaster();
  const token = await getToken();

  const users = await apiClient<User[]>("/users", {
    token: token!,
    cache: "no-store",
  });

  const filteredUsers = currentUser
    ? users.filter((user) => user.id !== currentUser.id)
    : users;

  return <UsersPageContent users={filteredUsers} />;
};

export default PageUsers;

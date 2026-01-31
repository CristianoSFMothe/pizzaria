import UsersTable from "@/components/dashboard/users-table";
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Usuários</h1>
        <p className="mt-2 text-sm text-gray-400 sm:text-base">
          Gerencie os usuários cadastrados no sistema
        </p>
      </div>

      <UsersTable initialUsers={filteredUsers} />
    </div>
  );
};

export default PageUsers;

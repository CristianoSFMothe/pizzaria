"use client";

import { updateUserRoleAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

interface UsersTableProps {
  initialUsers: User[];
}

const roleLabels: Record<User["role"], string> = {
  ADMIN: "Administrador",
  MASTER: "Master",
  STAFF: "Atendente",
};

const UsersTable = ({ initialUsers }: UsersTableProps) => {
  const [users, setUsers] = useState(initialUsers);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const handleUpdateRole = async (user: User) => {
    if (user.role === "MASTER") {
      toast.info("Usuário MASTER não pode ser alterado");
      return;
    }

    setUpdatingUserId(user.id);
    const toastId = toast.loading("Atualizando usuário...");

    const result = await updateUserRoleAction(user.id);

    if (!result.success) {
      toast.error(result.error || "Erro ao atualizar usuário", {
        id: toastId,
        duration: 3000,
        onAutoClose: () => setUpdatingUserId(null),
        onDismiss: () => setUpdatingUserId(null),
      });
      return;
    }

    const updatedRole =
      result.user?.role ?? (user.role === "ADMIN" ? "STAFF" : "ADMIN");

    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id ? { ...item, role: updatedRole } : item,
      ),
    );

    const roleLabel = roleLabels[updatedRole] ?? updatedRole;

    toast.success(`Usuário atualizado para ${roleLabel}`, {
      id: toastId,
      duration: 3000,
      onAutoClose: () => setUpdatingUserId(null),
      onDismiss: () => setUpdatingUserId(null),
    });
  };

  if (users.length === 0) {
    return (
      <div className="bg-app-card border-app-border rounded-xl border p-6 text-center text-gray-300">
        Nenhum usuário encontrado
      </div>
    );
  }

  return (
    <div className="bg-app-card border-app-border rounded-xl border text-white">
      <Table>
        <TableHeader>
          <TableRow className="border-app-border">
            <TableHead className="text-gray-300">Nome</TableHead>
            <TableHead className="text-gray-300">Cargo</TableHead>
            <TableHead className="text-right text-gray-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-app-border">
              <TableCell className="font-medium text-white">
                {user.name}
              </TableCell>
              <TableCell className="text-gray-200">
                {roleLabels[user.role] ?? user.role}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  size="sm"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                  onClick={() => handleUpdateRole(user)}
                  disabled={updatingUserId === user.id}
                >
                  {updatingUserId === user.id ? "Atualizando..." : "Atualizar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;

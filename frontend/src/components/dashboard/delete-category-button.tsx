"use client";

import { deleteCategoryAction } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
}

const DeleteCategoryButton = ({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    const result = await deleteCategoryAction(categoryId);

    if (!result.success) {
      toast.error(result.error || "Erro ao excluir categoria");
      setIsDeleting(false);
      return;
    }

    toast.success("Categoria excluída com sucesso");
    router.refresh();
    setIsDeleting(false);
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              aria-label={`Excluir categoria ${categoryName}`}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          Excluir categoria
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent className="bg-app-card border-app-border text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria &quot;{categoryName}
            &quot;? Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent" disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryButton;

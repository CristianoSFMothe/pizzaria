"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { deleteProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeleteButtonProductProps {
  productId: string;
}

const DeleteButtonProduct = ({ productId }: DeleteButtonProductProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProduct = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    const result = await deleteProductAction(productId);

    if (result.success) {
      router.refresh();
      toast.success("Produto excluído com sucesso");
    } else {
      toast.error(result.error || "Erro ao excluir produto");
    }

    setIsDeleting(false);
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive" size="icon">
              <Trash className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          Excluir produto
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent className="bg-app-card border-app-border text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir produto</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este produto?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent" disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteProduct}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive text-white"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButtonProduct;

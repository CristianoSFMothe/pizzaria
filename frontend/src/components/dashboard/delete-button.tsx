"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { deleteProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";

interface DeleteButtonProductProps {
  productId: string;
}

const DeleteButtonProduct = ({ productId }: DeleteButtonProductProps) => {
  const router = useRouter();

  const handleDeleteProduct = async () => {
    const result = await deleteProductAction(productId);

    if (result.success) {
      router.refresh();
      return;
    }
  };

  return (
    <Button onClick={handleDeleteProduct} variant="destructive">
      <Trash className="h-5 w-5" />
    </Button>
  );
};

export default DeleteButtonProduct;

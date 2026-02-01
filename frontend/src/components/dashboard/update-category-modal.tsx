"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { Categories } from "@/lib/types";
import { categorySchema } from "@/lib/validations/category";
import { updateCategoryAction } from "@/actions/categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface UpdateCategoryModalProps {
  category: Categories;
}

const UpdateCategoryModal = ({ category }: UpdateCategoryModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) {
      setName(category.name);
      setFieldErrors({});
    }
  };

  const handleUpdateCategory = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const values = { name: name.trim() };
    const result = categorySchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({ name: errors.name?.[0] });
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    const actionResult = await updateCategoryAction(category.id, values.name);

    setIsLoading(false);

    if (actionResult.success) {
      toast.success("Categoria atualizada com sucesso");
      setOpen(false);
      router.refresh();
      return;
    }

    toast.error(actionResult.error || "Erro ao atualizar categoria");
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label={`Editar categoria ${category.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          Editar categoria
        </TooltipContent>
      </Tooltip>

      <DialogContent className="bg-app-card p-6 text-white">
        <DialogHeader>
          <DialogTitle>Atualizar categoria</DialogTitle>
          <DialogDescription>Edite o nome da categoria</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleUpdateCategory}
          className="space-y-4"
          noValidate
        >
          <div className="mt-4">
            <Label htmlFor={`category-${category.id}`} className="mb-2">
              Nome da categoria
            </Label>

            <Input
              id={`category-${category.id}`}
              name="name"
              type="text"
              required
              value={name}
              placeholder="Digite o nome da categoria..."
              onChange={handleFieldChange}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={
                fieldErrors.name
                  ? `category-name-error-${category.id}`
                  : undefined
              }
              className="border-app-border bg-app-background text-white"
            />
            {fieldErrors.name && (
              <p
                id={`category-name-error-${category.id}`}
                className="text-xs text-red-400"
              >
                {fieldErrors.name}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-brand-primary hover:bg-brand-primary/90 w-full text-white"
          >
            {isLoading ? "Atualizando..." : "Atualizar categoria"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategoryModal;

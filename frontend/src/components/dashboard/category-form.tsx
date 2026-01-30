"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createCategoryAction } from "@/actions/categories";
import { useRouter } from "next/navigation";
import { categorySchema } from "@/lib/validations/category";
import { toast } from "sonner";

const CategoryForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});
  const router = useRouter();

  const handleCreateCategory = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
    };

    const result = categorySchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({ name: errors.name?.[0] });
      return;
    }

    setFieldErrors({});

    const actionResult = await createCategoryAction(formData);

    if (actionResult.success) {
      toast.success("Categoria criada com sucesso");
      setIsOpen(false);
      router.refresh();
      return;
    }

    toast.error(actionResult.error || "Erro ao criar categoria");
  };

  const handleFieldChange = () => {
    if (!fieldErrors.name) return;
    setFieldErrors((prev) => ({ ...prev, name: undefined }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-primary hover:bg-brand-primary/90 font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Nova categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-app-card p-6 text-white">
        <DialogHeader>
          <DialogTitle>Criar nova categoria</DialogTitle>
          <DialogDescription>Adicione nova categoria</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleCreateCategory}
          className="space-y-4"
          noValidate
        >
          <div className="mt-4">
            <Label htmlFor="category" className="mb-2">
              Nome da categoria
            </Label>

            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Digite o nome da categoria..."
              onChange={handleFieldChange}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={
                fieldErrors.name ? "category-name-error" : undefined
              }
              className="border-app-border bg-app-background text-white"
            />
            {fieldErrors.name && (
              <p id="category-name-error" className="text-xs text-red-400">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/90 w-full text-white"
          >
            Criar categoria
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;

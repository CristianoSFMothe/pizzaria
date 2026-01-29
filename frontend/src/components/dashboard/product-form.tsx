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
import { Plus, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";
import { Categories } from "@/lib/types";
import Image from "next/image";
import {
  MAX_PRODUCT_IMAGE_SIZE,
  PRODUCT_IMAGE_TYPES,
  productSchema,
} from "@/lib/validations/product";
import { toast } from "sonner";

interface ProductFormProps {
  categories: Categories[];
}

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [priceValue, setPriceValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    price?: string;
    description?: string;
    categoryId?: string;
    imageFile?: string;
  }>({});

  const convertBRLToCents = (value: string): number => {
    const clearValue = value
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    const reais = parseFloat(clearValue) || 0;

    return Math.round(reais * 100);
  };

  const handleCreateProduct = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      price: String(formData.get("price") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      categoryId: selectedCategory,
      imageFile,
    };

    const result = productSchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      setFieldErrors({
        name: errors.name?.[0],
        price: errors.price?.[0],
        description: errors.description?.[0],
        categoryId: errors.categoryId?.[0],
        imageFile: errors.imageFile?.[0],
      });
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    const productFormData = new FormData();

    const priceInCents = convertBRLToCents(priceValue);

    productFormData.append("name", values.name);
    productFormData.append("description", values.description);
    productFormData.append("price", priceInCents.toString());
    productFormData.append("categoryId", values.categoryId);
    productFormData.append("file", imageFile as File);

    const actionResult = await createProductAction(productFormData);

    setIsLoading(false);

    if (actionResult.success) {
      toast.success("Produto criado com sucesso");
      setOpen(false);
      setSelectedCategory("");
      setPriceValue("");
      setImagePreview(null);
      setImageFile(null);
      router.refresh();
      return;
    } else {
      console.log(actionResult.error);
      alert(actionResult.error);
    }
  };

  const formatToBrl = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";

    const amount = parseInt(numbers) / 100;

    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatToBrl(event.target.value);
    setPriceValue(formatted);
    if (fieldErrors.price) {
      setFieldErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
        setFieldErrors((prev) => ({
          ...prev,
          imageFile: "Imagem deve ter no máximo 5MB",
        }));
        return;
      }

      if (!PRODUCT_IMAGE_TYPES.includes(file.type)) {
        setFieldErrors((prev) => ({
          ...prev,
          imageFile: "Formato de imagem inválido",
        }));
        return;
      }

      setImageFile(file);
      if (fieldErrors.imageFile) {
        setFieldErrors((prev) => ({ ...prev, imageFile: undefined }));
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fieldErrors.imageFile) {
      setFieldErrors((prev) => ({ ...prev, imageFile: undefined }));
    }
  };

  const handleFieldChange =
    (field: "name" | "description") =>
    () => {
      if (!fieldErrors[field]) return;
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (fieldErrors.categoryId) {
      setFieldErrors((prev) => ({ ...prev, categoryId: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-primary hover:bg-brand-primary font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Novo produto
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-app-card max-h-[90vh] overflow-y-auto p-6 text-white">
        <DialogHeader>
          <DialogTitle>Criar novo produto</DialogTitle>
          <DialogDescription>Criando novo produto...</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          noValidate
          onSubmit={handleCreateProduct}
        >
          <div>
            <Label htmlFor="name" className="mb-2">
              Nome do produto
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Digite o nome do produto..."
              onChange={handleFieldChange("name")}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={
                fieldErrors.name ? "product-name-error" : undefined
              }
              className="border-app-border bg-app-background text-white"
            />
            {fieldErrors.name && (
              <p id="product-name-error" className="text-xs text-red-400">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="price" className="mb-2">
              Preço
            </Label>
            <Input
              id="price"
              name="price"
              required
              placeholder="Ex: R$ 35,00"
              className="border-app-border bg-app-background text-white"
              value={priceValue}
              onChange={handlePriceChange}
              aria-invalid={Boolean(fieldErrors.price)}
              aria-describedby={
                fieldErrors.price ? "product-price-error" : undefined
              }
            />
            {fieldErrors.price && (
              <p id="product-price-error" className="text-xs text-red-400">
                {fieldErrors.price}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Digite a descrição do produto..."
              onChange={handleFieldChange("description")}
              aria-invalid={Boolean(fieldErrors.description)}
              aria-describedby={
                fieldErrors.description ? "product-description-error" : undefined
              }
              className="border-app-border bg-app-background min-h-25 text-white"
            />
            {fieldErrors.description && (
              <p id="product-description-error" className="text-xs text-red-400">
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category" className="mb-2">
              Categoria
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger
                className="border-app-border bg-app-background text-white"
                aria-invalid={Boolean(fieldErrors.categoryId)}
                aria-describedby={
                  fieldErrors.categoryId ? "product-category-error" : undefined
                }
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-app-card border-app-border">
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="cursor-pointer text-white hover:bg-transparent"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.categoryId && (
              <p id="product-category-error" className="text-xs text-red-400">
                {fieldErrors.categoryId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="mb-2">
              Imagem do produto
            </Label>
            {imagePreview ? (
              <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                <Image
                  src={imagePreview}
                  alt="Previa de visualização da imagem do produto"
                  quality={100}
                  priority
                  fill
                  className="z-10 object-cover"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 z-20"
                >
                  Excluir
                </Button>
              </div>
            ) : (
              <Label
                htmlFor="file"
                className="flex cursor-pointer flex-col items-center rounded-md border-2 border-dashed p-8"
              >
                <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <span>Clique para selecionar uma imagem</span>

                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/jpg,image.png"
                  onChange={handleImageChange}
                  required
                  className="sr-only"
                  aria-invalid={Boolean(fieldErrors.imageFile)}
                  aria-describedby={
                    fieldErrors.imageFile ? "product-image-error" : undefined
                  }
                />
              </Label>
            )}
            {fieldErrors.imageFile && (
              <p id="product-image-error" className="text-xs text-red-400">
                {fieldErrors.imageFile}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !selectedCategory}
            className="bg-brand-primary hover:bg-brand-primary w-full text-white disabled:opacity-50"
          >
            {isLoading ? "Criando..." : "Criar produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

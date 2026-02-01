"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Upload } from "lucide-react";
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
import Image from "next/image";
import { Categories, Product } from "@/lib/types";
import { updateProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";
import {
  MAX_PRODUCT_IMAGE_SIZE,
  PRODUCT_IMAGE_TYPES,
  updateProductSchema,
} from "@/lib/validations/product";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface UpdateProductModalProps {
  product: Product;
  categories: Categories[];
}

const formatCentsToBrl = (priceInCents: number) => {
  return (priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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

const convertBRLToCents = (value: string): number => {
  const clearValue = value
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const reais = parseFloat(clearValue) || 0;

  return Math.round(reais * 100);
};

const resolveCategoryId = (
  product: Product,
  categories: Categories[],
): string | undefined => {
  const directId =
    product.category?.id ?? product.categoryId ?? product.category_id;

  if (directId) return String(directId);

  const categoryName = product.category?.name;

  if (!categoryName) return undefined;

  const matched = categories.find((category) => category.name === categoryName);

  return matched ? String(matched.id) : undefined;
};

const UpdateProductModal = ({
  product,
  categories,
}: UpdateProductModalProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [priceValue, setPriceValue] = useState(
    formatCentsToBrl(product.price),
  );
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >(resolveCategoryId(product, categories));
  const [imagePreview, setImagePreview] = useState<string | null>(
    product.banner,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    price?: string;
    description?: string;
    categoryId?: string;
    imageFile?: string;
  }>({});

  const resetForm = () => {
    setName(product.name);
    setDescription(product.description);
    setPriceValue(formatCentsToBrl(product.price));
    setSelectedCategory(resolveCategoryId(product, categories));
    setImagePreview(product.banner);
    setImageFile(null);
    setFieldErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) {
      resetForm();
    }
  };

  React.useEffect(() => {
    if (!open) return;
    setSelectedCategory(resolveCategoryId(product, categories));
  }, [open, product, categories]);

  const handleUpdateProduct = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const values = {
      name: name.trim(),
      price: priceValue.trim(),
      description: description.trim(),
      categoryId: effectiveCategoryId ?? "",
      imageFile,
    };

    const result = updateProductSchema.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten()
        .fieldErrors as Partial<Record<keyof typeof values, string[]>>;
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

    if (imageFile) {
      productFormData.append("file", imageFile);
    }

    const actionResult = await updateProductAction(product.id, productFormData);

    setIsLoading(false);

    if (actionResult.success) {
      toast.success("Produto atualizado com sucesso");
      setOpen(false);
      router.refresh();
      return;
    }

    toast.error(actionResult.error || "Erro ao atualizar produto");
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatToBrl(event.target.value);
    setPriceValue(formatted);
    if (fieldErrors.price) {
      setFieldErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (fieldErrors.categoryId) {
      setFieldErrors((prev) => ({ ...prev, categoryId: undefined }));
    }
  };

  const resolvedCategoryId = resolveCategoryId(product, categories);
  const resolvedCategoryName =
    product.category?.name ??
    categories.find((category) => category.id === resolvedCategoryId)?.name ??
    (resolvedCategoryId ? "Categoria atual" : undefined);
  const hasCategoryOption =
    Boolean(resolvedCategoryId) &&
    categories.some((category) => category.id === resolvedCategoryId);
  const effectiveCategoryId = selectedCategory ?? resolvedCategoryId;

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
    setImagePreview(product.banner);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (fieldErrors.imageFile) {
      setFieldErrors((prev) => ({ ...prev, imageFile: undefined }));
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
              aria-label="Editar produto"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          Editar produto
        </TooltipContent>
      </Tooltip>

      <DialogContent className="bg-app-card max-h-[90vh] overflow-x-hidden overflow-y-auto p-6 text-white">
        <DialogHeader>
          <DialogTitle>Atualizar produto</DialogTitle>
          <DialogDescription>Edite as informações do produto</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          noValidate
          onSubmit={handleUpdateProduct}
        >
          <div>
            <Label htmlFor={`name-${product.id}`} className="mb-2">
              Nome do produto
            </Label>
            <Input
              id={`name-${product.id}`}
              name="name"
              required
              value={name}
              placeholder="Digite o nome do produto..."
              onChange={(event) => {
                setName(event.target.value);
                if (fieldErrors.name) {
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={
                fieldErrors.name ? `product-name-error-${product.id}` : undefined
              }
              className="border-app-border bg-app-background text-white"
            />
            {fieldErrors.name && (
              <p
                id={`product-name-error-${product.id}`}
                className="text-xs text-red-400"
              >
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`price-${product.id}`} className="mb-2">
              Preço
            </Label>
            <Input
              id={`price-${product.id}`}
              name="price"
              required
              placeholder="Ex: R$ 35,00"
              className="border-app-border bg-app-background text-white"
              value={priceValue}
              onChange={handlePriceChange}
              aria-invalid={Boolean(fieldErrors.price)}
              aria-describedby={
                fieldErrors.price
                  ? `product-price-error-${product.id}`
                  : undefined
              }
            />
            {fieldErrors.price && (
              <p
                id={`product-price-error-${product.id}`}
                className="text-xs text-red-400"
              >
                {fieldErrors.price}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`description-${product.id}`} className="mb-2">
              Descrição
            </Label>
            <Textarea
              id={`description-${product.id}`}
              name="description"
              required
              value={description}
              placeholder="Digite a descrição do produto..."
              onChange={(event) => {
                setDescription(event.target.value);
                if (fieldErrors.description) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    description: undefined,
                  }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.description)}
              aria-describedby={
                fieldErrors.description
                  ? `product-description-error-${product.id}`
                  : undefined
              }
              className="border-app-border bg-app-background min-h-25 resize-none text-white"
            />
            {fieldErrors.description && (
              <p
                id={`product-description-error-${product.id}`}
                className="text-xs text-red-400"
              >
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2">Categoria</Label>
            <Select
              value={effectiveCategoryId}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger
                className="border-app-border bg-app-background text-white"
                aria-invalid={Boolean(fieldErrors.categoryId)}
                aria-describedby={
                  fieldErrors.categoryId
                    ? `product-category-error-${product.id}`
                    : undefined
                }
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-app-card border-app-border">
                {resolvedCategoryId &&
                  !hasCategoryOption &&
                  resolvedCategoryName && (
                    <SelectItem
                      value={resolvedCategoryId}
                      disabled
                      className="text-gray-400"
                    >
                      {resolvedCategoryName} (inativa)
                    </SelectItem>
                  )}
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
              <p
                id={`product-category-error-${product.id}`}
                className="text-xs text-red-400"
              >
                {fieldErrors.categoryId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`file-${product.id}`} className="mb-2">
              Imagem do produto
            </Label>

            {imagePreview ? (
              <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                <Image
                  src={imagePreview}
                  alt={`Imagem do produto ${product.name}`}
                  quality={100}
                  priority
                  fill
                  className="z-10 object-cover"
                />

                <div className="absolute top-2 right-2 z-20 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Trocar
                  </Button>
                  {imageFile && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleClearImage}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Label
                htmlFor={`file-${product.id}`}
                className="flex cursor-pointer flex-col items-center rounded-md border-2 border-dashed p-8"
              >
                <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <span>Clique para selecionar uma imagem</span>
              </Label>
            )}

            <Input
              ref={fileInputRef}
              id={`file-${product.id}`}
              name="file"
              type="file"
              accept="image/jpeg,image/jpg,image.png"
              onChange={handleImageChange}
              className="sr-only"
              aria-invalid={Boolean(fieldErrors.imageFile)}
              aria-describedby={
                fieldErrors.imageFile
                  ? `product-image-error-${product.id}`
                  : undefined
              }
            />
            {fieldErrors.imageFile && (
              <p
                id={`product-image-error-${product.id}`}
                className="text-xs text-red-400"
              >
                {fieldErrors.imageFile}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-brand-primary hover:bg-brand-primary w-full text-white disabled:opacity-50"
          >
            {isLoading ? "Atualizando..." : "Atualizar produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductModal;

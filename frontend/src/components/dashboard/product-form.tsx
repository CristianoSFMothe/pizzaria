"use client";
import React, { use, useState } from "react";
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
    setIsLoading(true);

    if (!imageFile) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    const formElement = event.currentTarget;

    const name = (formElement.elements.namedItem("name") as HTMLInputElement)
      ?.value;
    const description = (
      formElement.elements.namedItem("description") as HTMLInputElement
    )?.value;
    const priceInCents = convertBRLToCents(priceValue);

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", priceInCents.toString());
    formData.append("categoryId", selectedCategory);
    formData.append("file", imageFile);

    const result = await createProductAction(formData);

    setIsLoading(false);

    if (result.success) {
      setOpen(false);
      setSelectedCategory("");
      router.refresh();
      return;
    } else {
      console.log(result.error);
      alert(result.error);
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
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) return;

      setImageFile(file);

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

        <form className="space-y-4" onSubmit={handleCreateProduct}>
          <div>
            <Label htmlFor="name" className="mb-2">
              Nome do produto
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Digite o nome do produto..."
              className="border-app-border bg-app-background text-white"
            />
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
            />
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
              className="border-app-border bg-app-background min-h-25 text-white"
            />
          </div>

          <div>
            <Label htmlFor="category" className="mb-2">
              Categoria
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              required
            >
              <SelectTrigger className="border-app-border bg-app-background text-white">
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
                />
              </Label>
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

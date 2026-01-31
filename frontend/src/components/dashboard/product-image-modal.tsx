"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductImageModalProps {
  src: string;
  alt: string;
  className?: string;
}

const ProductImageModal = ({ src, alt, className }: ProductImageModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Ver imagem do produto ${alt}`}
          className={cn(
            "relative h-48 w-full overflow-hidden focus:outline-none",
            className,
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-app-card w-[90vw] max-w-4xl overflow-hidden p-4 text-white">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Imagem completa do produto
          </DialogTitle>
        </DialogHeader>
        <div className="relative h-[70vh] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="90vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageModal;

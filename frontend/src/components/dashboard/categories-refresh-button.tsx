"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const CategoriesRefreshButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button
      className="bg-brand-primary hover:bg-brand-primary/90 text-white"
      onClick={handleRefresh}
      disabled={isPending}
      aria-busy={isPending}
      type="button"
    >
      <RefreshCw className={isPending ? "animate-spin" : ""} />
    </Button>
  );
};

export default CategoriesRefreshButton;

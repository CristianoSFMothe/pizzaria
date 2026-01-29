"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface OrdersProps {
  token: string;
}

const Orders = ({ token }: OrdersProps) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient<Order[]>("/orders?draft=false", {
        method: "GET",
        cache: "no-store",
        token,
      });

      setOrders(response);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
    };

    loadOrders();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Pedidos</h1>
          <p className="mt-1 text-sm sm:text-base">
            Gerencie os pedidos da cozinha
          </p>
        </div>

        <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white">
          <RefreshCw />
        </Button>
      </div>
    </div>
  );
};

export default Orders;

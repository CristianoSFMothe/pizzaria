"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { EyeIcon, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format";

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

      const pendingOrders = response.filter((orders) => !orders.status);

      setOrders(pendingOrders);

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

  const calculateOrderTotal = (order: Order) => {
    if (!order.items) return 0;

    return order.items.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Pedidos</h1>
          <p className="mt-1 text-sm sm:text-base">
            Gerencie os pedidos da cozinha
          </p>
        </div>

        <Button
          className="bg-brand-primary hover:bg-brand-primary/90 text-white"
          onClick={fetchOrders}
        >
          <RefreshCw />
        </Button>
      </div>

      {loading ? (
        <div>
          <p className="text-center text-gray-300">Carregando...</p>
        </div>
      ) : orders.length === 0 ? (
        <div>
          <p className="text-center text-gray-300">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-app-card border-app-border text-white"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg font-bold text-white lg:text-xl">
                    Mesa {order.table}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs select-none">
                    Em produção
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="mt-auto space-y-3 sm:space-y-4">
                <div>
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <p
                          key={item.id}
                          className="truncate text-xs text-gray-300 sm:text-sm"
                        >
                          ＃ {item.amount}x {item.product.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-app-border flex flex-col items-center justify-between gap-3 border-t pt-4 xl:flex-row">
                  <div className="g2 self-start">
                    <p className="text-sm text-gray-400 md:text-base">Total</p>
                    <p className="text-brand-primary text-base font-bold">
                      {formatPrice(calculateOrderTotal(order))}
                    </p>
                  </div>

                  <Button
                    className="bg-brand-primary hover:bg-brand-primary/90 w-full text-white xl:w-auto"
                    size="sm"
                  >
                    <EyeIcon className="h-5 w-5" />
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

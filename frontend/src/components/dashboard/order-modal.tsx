import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { finishOrderAction } from "@/actions/order";
import { useRouter } from "next/navigation";

interface OrderModalProps {
  orderId: string | null;
  onClose: () => Promise<void>;
  token: string;
}

export const OrderModal = ({ onClose, orderId, token }: OrderModalProps) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    if (!orderId) {
      setOrder(null);
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient<Order>(
        `/order/detail?orderId=${orderId}`,
        {
          method: "GET",
          token: token,
        },
      );

      setOrder(response);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    async function loadOrders() {
      await fetchOrder();
    }

    loadOrders();
  }, [orderId]);

  const calculateTotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };

  const handlerFinishOrder = async () => {
    if (!orderId) return;
    const result = await finishOrderAction(orderId);

    if (!result.success) {
      console.log(result.error);
    }

    if (result.success) {
      router.refresh();
      onClose();
    }
  };

  return (
    <Dialog open={orderId !== null} onOpenChange={() => onClose()}>
      <DialogContent className="bg-app-card max-w-2xl p-6 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalhe do pedido
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Carregando...</p>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="mb-1 text-sm text-gray-400">Nome da categoria</p>
                <p className="text-lg font-semibold">Mesa {order.table}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-400">Cliente</p>
                <p className="text-lg font-semibold">
                  {order.name || "Sem nome"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-400">Status</p>
                <span className="inline-block rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-500">
                  Em produção
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Itens do pedido</h3>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => {
                    const subtotal = item.product.price * item.amount;
                    return (
                      <div
                        key={item.id}
                        className="bg-app-background border-app-border rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="mb-1 text-base font-semibold">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {item.product.description}
                            </p>
                            <p className="mt-2 text-sm text-gray-400">
                              {formatPrice(item.product.price)} x {item.amount}
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="mb-1 text-sm text-gray-400">
                              Quantidade: {item.amount}
                            </p>
                            <p className="text-lg font-semibold">
                              Subtotal: {formatPrice(subtotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-4 text-center text-gray-400">
                    Nenhum item no pedido
                  </p>
                )}
              </div>
            </div>

            <div className="border-app-border border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">Total</span>
                <span className="text-brand-primary text-2xl font-bold">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onClose()}
            className="border-app-border flex-1 bg-transparent text-white hover:bg-transparent hover:text-white"
          >
            Fechar
          </Button>
          <Button
            className="bg-brand-primary hover:bg-brand-primary/90 flex-1 font-semibold text-white"
            disabled={loading}
            onClick={handlerFinishOrder}
          >
            Finalizar pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

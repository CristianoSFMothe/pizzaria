import { Request, Response } from "express";
import { DeleteOrderService } from "../../services/order/DeleteOrderService";

class DeleteOrderController {
  async handle(req: Request, res: Response) {
    const orderId = req.query?.orderId as string;

    const deleteOrder = new DeleteOrderService();

    const order = await deleteOrder.execute({ orderId: orderId });
    res.json(order);
  }
}

export { DeleteOrderController };

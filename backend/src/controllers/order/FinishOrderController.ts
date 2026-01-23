import { Request, Response } from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.body;

    const finishOrder = new FinishOrderService();
    const order = await finishOrder.execute({ orderId: orderId });

    res.status(200).json(order);
  }
}

export { FinishOrderController };

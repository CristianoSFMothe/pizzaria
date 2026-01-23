import { Request, Response } from "express";
import { SendOrderService } from "../../services/order/SendOrderService";

class SendOrderController {
  async handle(req: Request, res: Response) {
    const { orderId, name } = req.body;

    const sendOrder = new SendOrderService();
    const order = await sendOrder.execute({ name: name, orderId: orderId });

    res.status(200).json(order);
  }
}

export { SendOrderController };

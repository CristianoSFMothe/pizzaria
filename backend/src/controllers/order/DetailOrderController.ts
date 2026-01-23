import { Request, Response } from "express";
import { DetailOrderService } from "../../services/order/DetailOrderService";

class DetailOrderController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.query;

    const detailOrder = new DetailOrderService();

    const order = await detailOrder.execute({
      orderId: orderId as string,
    });

    res.status(200).json(order);
  }
}

export { DetailOrderController };

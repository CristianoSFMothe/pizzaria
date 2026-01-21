import { Request, Response } from "express";
import { AddItemOrderService } from "../../services/order/AddItemOrderService";

class AddItemController {
  async handle(req: Request, res: Response) {
    const { orderId, productId, amount } = req.body;

    const addItem = new AddItemOrderService();

    const newItem = await addItem.execute({
      orderId,
      productId,
      amount,
    });

    res.status(201).json(newItem);
  }
}

export { AddItemController };

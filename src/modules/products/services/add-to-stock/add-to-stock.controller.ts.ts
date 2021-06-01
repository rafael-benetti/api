import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import AddToStockService from './add-to-stock.service';

abstract class AddToStockController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    const { groupId, quantity, type, cost } = req.body;

    const addToStock = container.resolve(AddToStockService);

    await addToStock.execute({
      userId,
      groupId,
      productId,
      quantity,
      type,
      cost,
    });

    return res.status(204).send();
  };
}

export default AddToStockController;

import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import TransferProductService from './transfer-product.service';

abstract class TransferProductController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    const { groupId, targetGroupId, quantity } = req.body;

    const transferProduct = container.resolve(TransferProductService);

    await transferProduct.execute({
      userId,
      groupId,
      targetGroupId,
      productId,
      quantity,
    });

    return res.status(204).send();
  };
}

export default TransferProductController;

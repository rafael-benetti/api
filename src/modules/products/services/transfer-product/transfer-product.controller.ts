import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import TransferProductService from './transfer-product.service';

abstract class TransferProductController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    const { productType, productQuantity, from, to, cost } = req.body;

    const transferProduct = container.resolve(TransferProductService);

    await transferProduct.execute({
      userId,
      productId,
      productType,
      productQuantity,
      from,
      to,
      cost,
    });

    return res.status(204).send();
  };
}

export default TransferProductController;

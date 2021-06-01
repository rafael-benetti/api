import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import DeleteProductService from './delete-product.service';

abstract class DeleteProductController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    const { productType, from } = req.body;

    const deleteProduct = container.resolve(DeleteProductService);

    await deleteProduct.execute({
      userId,
      productId,
      productType,
      from,
    });

    return res.status(204).send();
  };
}

export default DeleteProductController;

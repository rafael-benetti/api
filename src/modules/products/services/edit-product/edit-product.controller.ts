import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import EditProductService from './edit-product.service';

abstract class EditProductController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    const { groupId, label, quantityDifference } = req.body;

    const editProduct = container.resolve(EditProductService);

    const product = await editProduct.execute({
      userId,
      groupId,
      productId,
      label,
      quantityDifference,
    });

    return res.json(product);
  };
}

export default EditProductController;

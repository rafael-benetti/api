import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateProductService from './create-product.service';

abstract class CreateProductController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { groupId, label, productType } = req.body;

    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({
      userId,
      groupId,
      label,
      productType,
    });

    return res.json(product);
  };
}

export default CreateProductController;

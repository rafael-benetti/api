import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateProductService from './create-product.service';

abstract class CreateProductController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { groupId, label, type } = req.body;

    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({
      userId,
      groupId,
      label,
      type,
    });

    return res.status(201).json(product);
  };
}

export default CreateProductController;

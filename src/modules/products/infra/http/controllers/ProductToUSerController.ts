import ProductToUserService from '@modules/products/services/CreateProductToUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProductToUserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { userId, productId, quantity } = req.body;

    const productToUserService = container.resolve(ProductToUserService);

    const productToUser = await productToUserService.execute({
      userId,
      productId,
      quantity,
    });

    return res.json(productToUser);
  }
}

import CreateProductService from '@modules/products/services/CreateProductService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProductsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const ownerId = req.userId;
    const { name, price, cost } = req.body;

    const createProductService = container.resolve(CreateProductService);

    const product = await createProductService.execute({
      cost,
      name,
      ownerId: parseInt(ownerId, 2),
      price,
    });

    return res.json(product);
  }
}

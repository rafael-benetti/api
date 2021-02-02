import CreateProductService from '@modules/products/services/CreateProductService';
import ListProductsService from '@modules/products/services/ListProductsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProductsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const ownerId = req.userId;
    const { name, price, cost, quantity } = req.body;

    const createProductService = container.resolve(CreateProductService);

    const product = await createProductService.execute({
      cost,
      name,
      ownerId,
      price,
      quantity,
    });

    return res.json(product);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listProductsService = container.resolve(ListProductsService);

    const products = await listProductsService.execute(userId);

    return res.json(products);
  }
}

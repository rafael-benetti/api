import CreateProductService from '@modules/products/services/CreateProductService';
import ListProductsService from '@modules/products/services/ListProductsService';
import UpdateProductsService from '@modules/products/services/UpdateProductsService';
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

  public async update(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { name, cost, quantity } = req.body;
    const { productId } = req.query;

    const updateProductsService = container.resolve(UpdateProductsService);

    const product = await updateProductsService.execute({
      id: Number(productId),
      cost,
      name,
      quantity,
      userId,
    });

    return res.json(product);
  }
}

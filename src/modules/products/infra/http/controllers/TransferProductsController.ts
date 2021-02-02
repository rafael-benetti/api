import TransferProductsService from '@modules/products/services/TransferProductsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class TransferProductsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { targetUserId, productId, quantity } = req.body;

    const transferProductService = container.resolve(TransferProductsService);

    const productToUser = await transferProductService.execute({
      productId,
      quantity,
      targetUserId,
      userId,
    });

    return res.json(productToUser);
  }
}

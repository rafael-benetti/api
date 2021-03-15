import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ListPointsOfSaleService from './list-points-of-sale.service';

abstract class ListPointsOfSaleController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listPointsOfSaleService = container.resolve(ListPointsOfSaleService);

    const pointsOfSale = await listPointsOfSaleService.execute(userId);

    return res.json(pointsOfSale);
  }
}

export default ListPointsOfSaleController;

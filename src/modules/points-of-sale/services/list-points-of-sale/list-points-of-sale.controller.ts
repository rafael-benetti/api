import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ListPointsOfSaleService from './list-points-of-sale.service';

abstract class ListPointsOfSaleController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { groupId, label, limit, offset } = req.query;

    const listPointsOfSaleService = container.resolve(ListPointsOfSaleService);

    const pointsOfSale = await listPointsOfSaleService.execute({
      userId,
      label: label as string,
      groupId: groupId as string,
      offset: Number(offset),
      limit: Number(limit),
    });

    return res.json(pointsOfSale);
  }
}

export default ListPointsOfSaleController;

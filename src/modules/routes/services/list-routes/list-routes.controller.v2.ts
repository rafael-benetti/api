import { Response, Request } from 'express';
import { container } from 'tsyringe';
import ListRoutesServiceV2 from './list-routes.service.v2';

abstract class ListRoutesControllerV2 {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const {
      groupId,
      operatorId,
      pointOfSaleId,
      label,
      limit,
      offset,
    } = req.query;

    const listRoutesService = container.resolve(ListRoutesServiceV2);

    const routes = await listRoutesService.execute({
      userId,
      limit: Number(limit),
      offset: Number(offset),
      groupId: groupId as string,
      operatorId: operatorId as string,
      pointOfSaleId: pointOfSaleId as string,
      label: label as string,
    });

    return res.json(routes);
  }
}

export default ListRoutesControllerV2;

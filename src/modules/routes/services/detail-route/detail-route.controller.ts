import Period from '@modules/machines/contracts/dtos/period.dto';
import { Response, Request } from 'express';
import { container } from 'tsyringe';
import DetailRouteService from './detail-route.service';

export default abstract class DetailRouteController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { routeId } = req.params;
    const { period } = req.query;

    const detailRouteService = container.resolve(DetailRouteService);

    const response = await detailRouteService.execute({
      routeId,
      userId,
      period: period as Period,
    });

    return res.json(response);
  }
}

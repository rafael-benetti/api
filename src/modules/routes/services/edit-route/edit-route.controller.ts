import { Request, Response } from 'express';
import { container } from 'tsyringe';
import EditRouteService from './edit-route.service';

abstract class EditRouteController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { routeId } = req.params;
    const { pointOfSaleIds, label, operatorId } = req.body;

    const editRouteService = container.resolve(EditRouteService);

    const route = await editRouteService.execute({
      userId,
      label,
      pointsOfSaleIds: pointOfSaleIds,
      operatorId,
      routeId,
    });

    return res.json(route);
  }
}

export default EditRouteController;

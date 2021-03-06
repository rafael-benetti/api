import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateRouteService from './create-route.service';

abstract class CreateRouteController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { pointsOfSaleIds, label, operatorId } = req.body;

    const createRouteService = container.resolve(CreateRouteService);

    const route = await createRouteService.execute({
      userId,
      pointsOfSaleIds,
      label,
      operatorId,
    });

    return res.json(route);
  }
}

export default CreateRouteController;

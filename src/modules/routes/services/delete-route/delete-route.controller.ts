import { Request, Response } from 'express';
import { container } from 'tsyringe';
import DeleteRouteService from './delete-route.service';

export default abstract class DeleteRouteController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { routeId } = req.params;

    const deleteRouteService = container.resolve(DeleteRouteService);

    await deleteRouteService.execute({
      routeId,
      userId,
    });

    return res.status(201);
  }
}

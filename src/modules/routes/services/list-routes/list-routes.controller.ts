import { Response, Request } from 'express';
import { container } from 'tsyringe';
import ListRoutesService from './list-routes.service';

abstract class ListRoutesController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listRoutesService = container.resolve(ListRoutesService);

    const routes = await listRoutesService.execute({
      userId,
    });

    return res.json(routes);
  }
}

export default ListRoutesController;

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateRouteService from './create-route.service';

class CreateRouteController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const { label, groupIds } = req.body;

    const createRouteService = container.resolve(CreateRouteService);

    const route = await createRouteService.execute({
      userId,
      label,
      groupIds,
    });

    return res.json(route);
  }
}

export default CreateRouteController;

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListCounterTypesService from './list-counter-types.service';

abstract class ListCounterTypesController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listCounterTypesService = container.resolve(ListCounterTypesService);

    const counterTypes = await listCounterTypesService.execute({
      userId,
    });

    return res.json(counterTypes);
  }
}

export default ListCounterTypesController;

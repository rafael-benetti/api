import CreateCounterGroupsService from '@modules/counters/services/CreateCounterGrouptsService';
import { container } from 'tsyringe';
import { Request, Response } from 'express';

class CounterGroupsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { machineId, name } = req.body;

    const createCounterGroupsService = container.resolve(
      CreateCounterGroupsService,
    );

    const counterGroup = await createCounterGroupsService.execute({
      name,
      machineId,
    });

    return res.json(counterGroup);
  }
}

export default CounterGroupsController;

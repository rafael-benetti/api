import CreateCountersService from '@modules/counters/services/CreateCountersService';
import { container } from 'tsyringe';
import { Request, Response } from 'express';
import FindCountersService from '@modules/counters/services/FindCountersService';

class CountersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { countersRequests } = req.body;

    const createCountersService = container.resolve(CreateCountersService);

    const counters = await createCountersService.execute(countersRequests);

    return res.json(counters);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { machineId } = req.params;

    const findCountersService = container.resolve(FindCountersService);

    const counters = await findCountersService.execute(Number(machineId));

    return res.json(counters);
  }
}

export default CountersController;

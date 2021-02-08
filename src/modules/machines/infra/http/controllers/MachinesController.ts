import CreateMachineService from '@modules/machines/services/CreateMachineService';
import FindMachinesService from '@modules/machines/services/FindMachinesService';
import { Response, Request } from 'express';
import { container } from 'tsyringe';

class MachinesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      description,
      serialNumber,
      gameValue,
      companyId,
      sellingPointId,
      machineCategoryId,
      counters,
    } = req.body;

    const createMachineService = container.resolve(CreateMachineService);

    const machine = await createMachineService.execute({
      description,
      serialNumber,
      gameValue,
      companyId,
      sellingPointId,
      machineCategoryId,
      counters,
    });

    return res.json(machine);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const { companyId, name, isActive, limit, page } = req.query;

    const listMachinesService = container.resolve(FindMachinesService);

    const machines = await listMachinesService.execute({
      userId,
      companyId: Number(companyId),
      name: name as string,
      isActive: isActive as string,
      limit: Number(limit),
      page: Number(page),
    });

    return res.json(machines);
  }
}

export default MachinesController;

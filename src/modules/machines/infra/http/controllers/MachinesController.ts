import CreateMachineService from '@modules/machines/services/CreateMachineService';
import FindMachinesService from '@modules/machines/services/FindMachinesService';
import UpdateMachinesService from '@modules/machines/services/UpdateMachinesService';
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

    const {
      companyId,
      machineCategoryId,
      keywords,
      isActive,
      limit,
      page,
    } = req.query;

    const findMachinesService = container.resolve(FindMachinesService);

    const { machines, machinesCount } = await findMachinesService.execute({
      userId,
      companyId: Number(companyId),
      machineCategoryId: Number(machineCategoryId),
      keywords: keywords as string,
      isActive: isActive as string,
      limit: Number(limit),
      page: Number(page),
    });

    return res.json({ machines, machinesCount });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { machineId } = req.query;
    const {
      description,
      serialNumber,
      gameValue,
      companyId,
      sellingPointId,
      machineCategoryId,
      counters,
    } = req.body;

    const updateMachinesService = container.resolve(UpdateMachinesService);

    const machine = await updateMachinesService.execute({
      id: Number(machineId),
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
}

export default MachinesController;

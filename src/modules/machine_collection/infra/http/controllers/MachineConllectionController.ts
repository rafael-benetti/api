import CreateMachineCollectionServices from '@modules/machine_collection/services/CreateMachineCollectionServices';
import { Response, Request } from 'express';
import { container } from 'tsyringe';

class MachineCollectionController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { machineId, machineCollectionCounter } = req.body;
    const { userId } = req;

    const createMachineCollectionService = container.resolve(
      CreateMachineCollectionServices,
    );

    const machineCollect = createMachineCollectionService.execute({
      machineId,
      userId,
      machineCollectionCounter,
    });

    return res.json(machineCollect);
  }
}

export default MachineCollectionController;

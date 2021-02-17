import CreateMachineCollectionService from '@modules/machine_collection/services/CreateMachineCollectionService';
import FindMachineCollectionService from '@modules/machine_collection/services/FindMachineCollectionService';
import { Response, Request } from 'express';
import { container } from 'tsyringe';

class MachineCollectionController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { machineId } = req.params;
    const { machineCollectCounters } = req.body;
    const { userId } = req;
    let photos: string[] | undefined;

    try {
      const files: { path: string }[] = JSON.parse(JSON.stringify(req.files));
      photos = files.map(file => file.path);
    } catch (error) {
      photos = [];
    }

    const createMachineCollectionService = container.resolve(
      CreateMachineCollectionService,
    );

    const machineCollect = await createMachineCollectionService.execute({
      machineId: Number(machineId),
      userId,
      machineCollectCounters: JSON.parse(machineCollectCounters),
      machineCollectCounterPhotos: photos,
    });

    return res.json(machineCollect);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { keywords } = req.query;

    const findMachineCollectionService = container.resolve(
      FindMachineCollectionService,
    );

    const machineCollection = await findMachineCollectionService.execute({
      userId,
      keywords: keywords as string,
    });

    return res.json(machineCollection);
  }
}

export default MachineCollectionController;

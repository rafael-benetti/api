import { container } from 'tsyringe';
import { Request, Response } from 'express';
import CreateMachineService from './create-machine.service';

abstract class CreateMachineController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const { categoryId, groupId, pointOfSaleId, serialNumber } = req.body;

    const createMachineService = container.resolve(CreateMachineService);

    const machine = await createMachineService.execute({
      userId,
      categoryId,
      groupId,
      pointOfSaleId,
      serialNumber,
    });

    return res.json(machine);
  }
}

export default CreateMachineController;

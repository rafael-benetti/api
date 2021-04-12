import { container } from 'tsyringe';
import { Request, Response } from 'express';
import CreateMachineService from './create-machine.service';

abstract class CreateMachineController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const {
      boxes,
      categoryId,
      gameValue,
      groupId,
      locationId,
      operatorId,
      serialNumber,
      telemetryBoardId,
    } = req.body;

    const createMachineService = container.resolve(CreateMachineService);

    const machine = await createMachineService.execute({
      boxes,
      categoryId,
      gameValue,
      groupId,
      locationId,
      operatorId,
      serialNumber,
      userId,
      telemetryBoardId,
    });

    return res.json(machine);
  }
}

export default CreateMachineController;

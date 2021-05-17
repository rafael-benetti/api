import { Response, Request } from 'express';
import { container } from 'tsyringe';
import EditMachineService from './edit-machine.service';

abstract class EditMachineController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { machineId } = req.params;
    const {
      boxes,
      categoryId,
      gameValue,
      groupId,
      locationId,
      operatorId,
      serialNumber,
      isActive,
      telemetryBoardId,
      maintenance,
      typeOfPrizeId,
      minimumPrizeCount,
      incomePerMonthGoal,
      incomePerPrizeGoal,
    } = req.body;

    const editMachineService = container.resolve(EditMachineService);

    const machine = await editMachineService.execute({
      boxes,
      categoryId,
      gameValue,
      groupId,
      locationId,
      machineId,
      operatorId,
      serialNumber,
      userId,
      isActive,
      telemetryBoardId,
      maintenance,
      typeOfPrizeId,
      minimumPrizeCount,
      incomePerMonthGoal,
      incomePerPrizeGoal,
    });

    return res.json(machine);
  }
}

export default EditMachineController;

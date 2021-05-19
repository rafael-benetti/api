import Period from '@modules/machines/contracts/dtos/period.dto';
import { Response, Request } from 'express';
import { container } from 'tsyringe';
import GetMachineDetailsService from './get-machine-details.service';

abstract class GetMachineDetailsController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { machineId } = req.params;
    const { period, startDate, endDate } = req.query;

    const getMachineDetailsService = container.resolve(
      GetMachineDetailsService,
    );

    const response = await getMachineDetailsService.execute({
      machineId,
      userId,
      period: period as Period,
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
    });

    return res.json(response);
  }
}

export default GetMachineDetailsController;

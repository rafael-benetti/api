import { Response, Request } from 'express';
import { container } from 'tsyringe';
import GetMachineDetailsService from './get-machine-details.service';

abstract class GetMachineDetailsController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { machineId } = req.params;

    const getMachineDetailsService = container.resolve(
      GetMachineDetailsService,
    );

    const response = await getMachineDetailsService.execute({
      machineId,
      userId,
    });

    return res.json(response);
  }
}

export default GetMachineDetailsController;

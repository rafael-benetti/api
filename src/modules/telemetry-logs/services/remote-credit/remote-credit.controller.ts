import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RemoteCreditService from './remote-credit.service';

abstract class RemoteCreditController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { machineId } = req.params;

    const remoteCreditService = container.resolve(RemoteCreditService);

    await remoteCreditService.execute({
      userId,
      machineId,
    });

    return res.json({ ok: true });
  }
}

export default RemoteCreditController;

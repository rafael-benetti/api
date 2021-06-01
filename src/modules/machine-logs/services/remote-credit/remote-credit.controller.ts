import { celebrate, Joi } from 'celebrate';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RemoteCreditService from './remote-credit.service';

abstract class RemoteCreditController {
  static validate = celebrate({
    body: {
      quantity: Joi.number().required(),
      observations: Joi.string().required(),
    },
    params: {
      machineId: Joi.string().uuid().required(),
    },
  });

  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { machineId } = req.params;
    const { observations, quantity } = req.body;

    const remoteCreditService = container.resolve(RemoteCreditService);

    await remoteCreditService.execute({
      userId,
      machineId,
      observations,
      quantity,
    });

    return res.status(204).json();
  }
}

export default RemoteCreditController;

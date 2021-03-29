import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCounterTypeService from './create-counter-type.service';

abstract class CreateCounterTypeController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { label, type } = req.body;

    const createCounterTypeService = container.resolve(
      CreateCounterTypeService,
    );

    const counterType = await createCounterTypeService.execute({
      userId,
      label,
      type,
    });

    return res.json(counterType);
  }
}

export default CreateCounterTypeController;

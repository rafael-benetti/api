import logger from '@config/logger';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import EditCounterTypeService from './edit-counter-type.service';

abstract class EditCounterTypeController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { counterTypeId } = req.params;
    const { label } = req.body;

    const editCounterTypeService = container.resolve(EditCounterTypeService);

    const counterType = await editCounterTypeService.execute({
      userId,
      counterTypeId,
      label,
    });

    return res.json(counterType);
  }
}

export default EditCounterTypeController;

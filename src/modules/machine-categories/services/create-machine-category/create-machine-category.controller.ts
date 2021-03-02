import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateMachineCategoryService from './create-machine-category.service';

abstract class CreateMachineCategoryController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { label } = req.body;

    const createMachineCategoryService = container.resolve(
      CreateMachineCategoryService,
    );

    const machineCategory = await createMachineCategoryService.execute({
      userId,
      label,
    });

    return res.json(machineCategory);
  }
}

export default CreateMachineCategoryController;

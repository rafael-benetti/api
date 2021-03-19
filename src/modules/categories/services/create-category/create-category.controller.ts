import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCategoryService from './create-category.service';

abstract class CreateCategoryController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { label, boxes } = req.body;

    const createCategoryService = container.resolve(CreateCategoryService);

    const category = await createCategoryService.execute({
      userId,
      label,
      boxes,
    });

    return res.json(category);
  }
}

export default CreateCategoryController;

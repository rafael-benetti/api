import { Request, Response } from 'express';
import { container } from 'tsyringe';
import EditCategoryService from './edit-category.service';

abstract class EditCategoryController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { label, boxes } = req.body;
    const { categoryId } = req.params;

    const editCategoryService = container.resolve(EditCategoryService);

    const category = await editCategoryService.execute({
      userId,
      categoryId,
      label,
      boxes,
    });

    return res.json(category);
  }
}

export default EditCategoryController;

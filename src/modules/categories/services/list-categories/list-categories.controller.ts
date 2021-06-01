import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListCategoriesService from './list-categories.service';

abstract class ListCategoriesController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listCategoriesService = container.resolve(ListCategoriesService);

    const category = await listCategoriesService.execute(userId);

    return res.json(category);
  }
}

export default ListCategoriesController;

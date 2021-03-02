import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ListMachineCategoriesService from './list-machine-categories.service';

abstract class ListMachineCategoriesController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listMachineCategoriesService = container.resolve(
      ListMachineCategoriesService,
    );

    const machineCategories = await listMachineCategoriesService.execute(
      userId,
    );

    return res.json(machineCategories);
  }
}

export default ListMachineCategoriesController;

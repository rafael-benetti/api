import CreateMachineCategoriesService from '@modules/machines/services/CreateMachineCategoriesService';
import ListMachineCategoriesService from '@modules/machines/services/FindMachineCategoriesService';
import ShowMachineCategoryService from '@modules/machines/services/showMachineCategoryService';
import UpdateMachineCategoriesService from '@modules/machines/services/UpdateMachineCategoriesService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class MachineCategoriesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { name } = req.body;

    const createMachineCategoriesService = container.resolve(
      CreateMachineCategoriesService,
    );

    const machineCategory = await createMachineCategoriesService.execute({
      name,
      ownerId: userId,
    });

    return res.json(machineCategory);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listMachineCategoriesService = container.resolve(
      ListMachineCategoriesService,
    );

    const machineCategories = await listMachineCategoriesService.execute(
      userId,
    );

    return res.json(machineCategories);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { machineCategoryId } = req.params;

    const showMachineCategoryService = container.resolve(
      ShowMachineCategoryService,
    );

    const machineCategory = await showMachineCategoryService.execute(
      Number(machineCategoryId),
    );

    return res.json(machineCategory);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { machineCategoryId } = req.query;
    const { name } = req.body;

    const updateMachineCategoriesService = container.resolve(
      UpdateMachineCategoriesService,
    );

    const machineCategory = await updateMachineCategoriesService.execute({
      id: Number(machineCategoryId),
      name,
    });

    return res.json(machineCategory);
  }
}

export default MachineCategoriesController;

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListMachinesService from './list-machines.service';

abstract class ListMachinesController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listMachinesService = container.resolve(ListMachinesService);

    const machines = await listMachinesService.execute(userId);

    return res.json(machines);
  }
}

export default ListMachinesController;

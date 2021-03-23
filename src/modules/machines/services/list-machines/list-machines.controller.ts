import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListMachinesService from './list-machines.service';

abstract class ListMachinesController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const {
      categoryId,
      groupId,
      routeId,
      pointOfSaleId,
      serialNumber,
      isActive,
    } = req.query;

    const listMachinesService = container.resolve(ListMachinesService);

    const machines = await listMachinesService.execute({
      userId,
      categoryId: categoryId as string,
      groupId: groupId as string,
      pointOfSaleId: pointOfSaleId as string,
      routeId: routeId as string,
      serialNumber: serialNumber as string,
      isActive: isActive?.toString() === 'true',
    });

    return res.json(machines);
  }
}

export default ListMachinesController;

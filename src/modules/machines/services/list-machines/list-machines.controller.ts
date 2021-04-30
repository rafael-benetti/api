import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListMachinesService from './list-machines.service';

abstract class ListMachinesController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const {
      lean,
      categoryId,
      groupId,
      routeId,
      pointOfSaleId,
      serialNumber,
      isActive,
      limit,
      offset,
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
      limit: Number(limit) as number,
      offset: Number(offset) as number,
      lean: lean?.toString() === 'true',
    });

    return res.json(machines);
  }
}

export default ListMachinesController;

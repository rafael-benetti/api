import MachineLogType from '@modules/machine-logs/contracts/enums/machine-log-type';
import { celebrate, Joi } from 'celebrate';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListMachineLogsService from './list-machine-logs.service';

abstract class ListMachineLogsController {
  static validate = celebrate({
    query: {
      startDate: Joi.date(),
      endDate: Joi.date(),
      limit: Joi.number(),
      offset: Joi.number(),
      machineId: Joi.string().required(),
      type: Joi.string().valid('REMOTE_CREDIT', 'FIX_STOCK'),
    },
  });

  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { limit, offset, machineId, startDate, endDate, type } = req.query;

    const listMachineLogsService = container.resolve(ListMachineLogsService);

    const machineLogs = await listMachineLogsService.execute({
      userId,
      machineId: machineId as string,
      type: type as MachineLogType,
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
      limit: Number(limit),
      offset: Number(offset),
    });

    return res.json(machineLogs);
  }
}

export default ListMachineLogsController;

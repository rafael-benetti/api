import LogType from '@modules/logs/contracts/enums/log-type.enum';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ListLogsService from './list-logs.service';

abstract class ListLogsController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;

    const {
      start_date: startDate,
      end_date: endDate,
      type,
      owner_id: ownerId,
      limit,
      offset,
    } = req.query;
    const listLogs = container.resolve(ListLogsService);

    const logs = await listLogs.execute({
      adminId: userId,
      filters: {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        ownerId: ownerId as string,
        type: type as LogType[],
      },
      limit: Number(limit),
      offset: Number(offset),
    });

    return res.json(logs);
  };
}

export default ListLogsController;

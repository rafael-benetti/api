import LogType from '@modules/logs/contracts/enums/log-type.enum';
import { subMonths } from 'date-fns';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import DeleteLogsService from './delete-logs.service';

abstract class DeleteLogsController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;

    const { start_date: startDate, type, owner_id: ownerId } = req.query;
    const deleteLogsService = container.resolve(DeleteLogsService);

    const logs = await deleteLogsService.execute({
      adminId: userId,
      startDate: startDate
        ? new Date(startDate as string)
        : subMonths(new Date(), 6),
      ownerId: ownerId as string,
      type: type as LogType[],
    });

    return res.json(logs);
  };
}

export default DeleteLogsController;

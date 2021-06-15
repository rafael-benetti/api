import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ListTelemetryBoardsService from './list-telemetry-boards.service';

abstract class ListTelemetryBoardsController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { groupId, limit, offset } = req.query;

    const listTelemetryBoards = container.resolve(ListTelemetryBoardsService);

    const telemetryBoards = await listTelemetryBoards.execute({
      userId,
      groupId: groupId as string,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    return res.json(telemetryBoards);
  };
}

export default ListTelemetryBoardsController;

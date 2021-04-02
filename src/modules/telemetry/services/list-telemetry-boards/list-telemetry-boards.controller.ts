import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ListTelemetryBoardsService from './list-telemetry-boards.service';

abstract class ListTelemetryBoardsController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { limit, offset } = req.query;

    const listTelemetryBoards = container.resolve(ListTelemetryBoardsService);

    const telemetryBoards = await listTelemetryBoards.execute({
      userId,
      limit: limit as never,
      offset: offset as never,
    });

    return res.json(telemetryBoards);
  };
}

export default ListTelemetryBoardsController;

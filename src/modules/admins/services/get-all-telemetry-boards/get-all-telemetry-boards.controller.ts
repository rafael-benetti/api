import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GetAllTelemetryBoardsService from './get-all-telemetry-boards.service';

abstract class GetAllTelemetryBoardsController {
  static handle: RequestHandler = async (request, response) => {
    const getTelemetryBoards = container.resolve(GetAllTelemetryBoardsService);

    const telemetryBoards = await getTelemetryBoards.execute();

    return response.json(telemetryBoards);
  };
}

export default GetAllTelemetryBoardsController;

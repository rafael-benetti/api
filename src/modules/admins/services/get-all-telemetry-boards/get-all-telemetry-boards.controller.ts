import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GetAllTelemetryBoardsService from './get-all-telemetry-boards.service';

abstract class GetAllTelemetryBoardsController {
  static handle: RequestHandler = async (request, response) => {
    const { id, groupId, ownerId, limit, offset } = request.query;

    const getTelemetryBoards = container.resolve(GetAllTelemetryBoardsService);

    const telemetryBoards = await getTelemetryBoards.execute({
      id: id ? Number(id) : undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      groupId: groupId ? (groupId as string) : undefined,
      ownerId: ownerId ? (ownerId as string) : undefined,
    });

    return response.json(telemetryBoards);
  };
}

export default GetAllTelemetryBoardsController;

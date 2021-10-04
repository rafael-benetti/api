import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GetAllTelemetryBoardsService from './get-all-telemetry-boards.service';

abstract class GetAllTelemetryBoardsController {
  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { id, groupId, ownerId, orderBy, limit, offset } = request.query;

    const getTelemetryBoards = container.resolve(GetAllTelemetryBoardsService);

    const telemetryBoards = await getTelemetryBoards.execute({
      userId,
      id: id ? Number(id) : undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      groupId: groupId ? (groupId as string) : undefined,
      ownerId: ownerId ? (ownerId as string) : undefined,
      orderBy: orderBy ? (orderBy as 'ASC' | 'DESC') : 'ASC',
    });

    return response.json(telemetryBoards);
  };
}

export default GetAllTelemetryBoardsController;

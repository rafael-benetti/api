import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import { inject, injectable } from 'tsyringe';

interface Request {
  id?: number;
  limit?: number;
  offset?: number;
  groupId?: string;
  ownerId?: string;
}

@injectable()
class GetAllTelemetryBoardsService {
  constructor(
    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,
  ) {}

  async execute({
    id,
    limit,
    offset,
    ownerId,
    groupId,
  }: Request): Promise<{ telemetryBoards: TelemetryBoard[]; count: number }> {
    const telemetryBoards = await this.telemetryBoardsRepository.find({
      filters: {
        ...(id && { id: [id] }),
        ...(groupId && { groupIds: [groupId] }),
        ownerId,
      },
      limit,
      offset,
    });

    return telemetryBoards;
  }
}

export default GetAllTelemetryBoardsService;

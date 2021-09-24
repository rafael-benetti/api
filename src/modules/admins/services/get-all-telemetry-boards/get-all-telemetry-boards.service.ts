import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
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

    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    userId,
    id,
    limit,
    offset,
    ownerId,
    groupId,
  }: Request): Promise<{ telemetryBoards: TelemetryBoard[]; count: number }> {
    const admin = await this.adminsRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!admin) throw AppError.authorizationError;

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

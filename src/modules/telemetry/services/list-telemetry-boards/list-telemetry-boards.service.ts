import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  userId: string;
  limit?: number;
  offset?: number;
}

@injectable()
class ListTelemetryBoardsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,
  ) {}

  async execute({ userId, limit, offset }: Request): Promise<TelemetryBoard[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const telemetryBoards = await this.telemetryBoardsRepository.find({
      filters: {
        ownerId: user.role === Role.OWNER ? user.id : undefined,
        groupIds: user.role === Role.OWNER ? undefined : user.groupIds,
      },
      limit,
      offset,
    });

    return telemetryBoards;
  }
}

export default ListTelemetryBoardsService;

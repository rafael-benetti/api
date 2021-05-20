import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  telemetryId: number;
  groupId: string;
}

@injectable()
class EditTelemetryBoardService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    telemetryId,
    groupId,
  }: Request): Promise<TelemetryBoard> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER) throw AppError.authorizationError;

    const telemetryBoard = await this.telemetryBoardsRepository.findById(
      telemetryId,
    );

    if (!telemetryBoard) throw AppError.telemetryBoardNotFound;

    if (telemetryBoard.ownerId !== user.id) throw AppError.authorizationError;

    const group = await this.groupsRepository.findOne({
      by: 'id',
      value: groupId,
    });

    if (!group) throw AppError.groupNotFound;

    if (group.ownerId !== user.id) throw AppError.authorizationError;

    telemetryBoard.groupId = group.id;

    this.telemetryBoardsRepository.save(telemetryBoard);
    await this.ormProvider.commit();

    return telemetryBoard;
  }
}

export default EditTelemetryBoardService;

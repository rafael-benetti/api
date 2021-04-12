import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  ownerId: string;
}

@injectable()
class CreateTelemetryBoardService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ ownerId }: Request): Promise<TelemetryBoard> {
    const owner = await this.usersRepository.findOne({
      by: 'id',
      value: ownerId,
    });

    if (!owner || owner.role !== Role.OWNER) throw AppError.authorizationError;

    const personalGroup = await this.groupsRepository
      .find({
        filters: {
          ownerId,
          isPersonal: true,
        },
      })
      .then(groups => groups[0]);

    const telemetryBoard = await this.telemetryBoardsRepository.create({
      ownerId,
      groupId: personalGroup.id,
    });

    await this.ormProvider.commit();

    return telemetryBoard;
  }
}

export default CreateTelemetryBoardService;

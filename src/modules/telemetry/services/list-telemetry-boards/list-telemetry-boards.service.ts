import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  groupId: string;
  userId: string;
  telemetryBoardId?: number;
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

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  async execute({
    userId,
    groupId,
    telemetryBoardId,
    limit,
    offset,
  }: Request): Promise<{
    telemetryBoards: TelemetryBoard[];
    count: number;
  }> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    let groupIds;

    let telemetryBoardIds: number[] | undefined;

    if (groupId) {
      groupIds = [groupId];
    } else if (user.role === Role.MANAGER) {
      groupIds = user.groupIds;
    } else if (user.role === Role.OPERATOR) {
      const { machines } = await this.machinesRepository.find({
        operatorId: user.id,
      });
      telemetryBoardIds = machines
        .map(machine => machine.telemetryBoardId)
        .filter(telemetryBoardId => telemetryBoardId) as number[];

      groupIds = user.groupIds;
    } else if (user.role === Role.OWNER) {
      groupIds = (
        await this.groupsRepository.find({
          filters: {
            ownerId: user.id,
          },
        })
      ).map(group => group.id);
    }

    if (telemetryBoardId) telemetryBoardIds = [telemetryBoardId];

    const {
      telemetryBoards,
      count,
    } = await this.telemetryBoardsRepository.find({
      filters: {
        id: telemetryBoardIds,
        groupIds,
      },
      limit,
      offset,
    });

    return { telemetryBoards, count };
  }
}

export default ListTelemetryBoardsService;

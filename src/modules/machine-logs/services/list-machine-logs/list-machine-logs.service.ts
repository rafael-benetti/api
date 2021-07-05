import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MachineLog from '@modules/machine-logs/contracts/entities/machine-log';
import MachineLogType from '@modules/machine-logs/contracts/enums/machine-log-type';
import MachineLogsRepository from '@modules/machine-logs/contracts/repositories/machine-logs.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  machineId: string;
  userId: string;
  startDate?: Date;
  endDate?: Date;
  type?: MachineLogType;
  limit?: number;
  offset?: number;
}

@injectable()
class ListMachineLogsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachineLogsRepository')
    private machineLogsRepository: MachineLogsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  async execute({
    machineId,
    userId,
    type,
    startDate,
    endDate,
    limit,
    offset,
  }: Request): Promise<{
    machineLogs: MachineLog[];
    count: number;
  }> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
    });

    if (!machine) throw AppError.machineNotFound;

    if (
      user.role !== Role.MANAGER &&
      user.role !== Role.OPERATOR &&
      user.role !== Role.OWNER
    )
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER || user.role === Role.OPERATOR) {
      if (!user.groupIds?.includes(machine.groupId))
        throw AppError.authorizationError;
    }

    if (user.role === Role.OWNER) {
      const groupIds = (
        await this.groupsRepository.find({
          filters: {
            ownerId: user.id,
          },
        })
      ).map(group => group.id);

      if (!groupIds.includes(machine.groupId))
        throw AppError.authorizationError;
    }

    const machineLogs = await this.machineLogsRepository.find({
      startDate,
      endDate,
      groupId: machine.groupId,
      machineId,
      type,
      populate: ['user'],
      fields: [
        'user.name',
        'machineId',
        'groupId',
        'observations',
        'type',
        'createdAt',
        'createdBy',
        'quantity',
      ],
      offset,
      limit,
    });

    return machineLogs;
  }
}

export default ListMachineLogsService;

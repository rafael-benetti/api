import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import { inject, injectable } from 'tsyringe';
import { Promise } from 'bluebird';
import AppError from '@shared/errors/app-error';
import Group from '@modules/groups/contracts/models/group';
import Role from '@modules/users/contracts/enums/role';
import logger from '@config/logger';

interface Request {
  userId: string;
  groupId: string;
  startDate: Date;
  endDate: Date;
}

@injectable()
class GenerateMachinesReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,
  ) {}

  async execute({
    userId,
    groupId,
    startDate,
    endDate,
  }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    let groupIds: string[] = [];
    let groups: Group[] = [];

    if (groupId) {
      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: groupId,
      });

      if (!group) throw AppError.groupNotFound;

      if (user.role === Role.OWNER && group.ownerId !== user.id)
        throw AppError.authorizationError;

      if (user.role === Role.MANAGER && !user.groupIds?.includes(group.id))
        throw AppError.authorizationError;
      groups = [group];
      groupIds.push(groupId);
    } else if (user.role === Role.MANAGER) {
      if (!user.groupIds) throw AppError.unknownError;
      groupIds = user.groupIds;
      groups = await this.groupsRepository.find({
        filters: {
          ids: user.groupIds,
        },
      });
    } else if (user.role === Role.OWNER) {
      groups = await this.groupsRepository.find({
        filters: {
          ownerId: user.id,
        },
        fields: ['id', 'label'],
      });

      groupIds = groups.map(group => group.id);
    }

    await this.telemetryLogsRepository.getIncomePerMachine(groupIds);
  }
}

export default GenerateMachinesReportService;

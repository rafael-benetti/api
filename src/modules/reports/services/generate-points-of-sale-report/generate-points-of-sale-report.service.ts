import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { eachDayOfInterval } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { Promise } from 'bluebird';
import Group from '@modules/groups/contracts/models/group';

interface MachineInfos {
  machine: Machine;
  income: number;
  givenPrizes: number;
  plays: number;
  playsPerPrize: number;
  averagePerDay: number;
  incomePerMonthGoal?: number;
  incomePerPrizeGoal?: number;
}

interface Response {
  group: Group;
  pointsOfSale: {
    pointOfSale: PointOfSale;
    machineInfos: MachineInfos[];
  }[];
}

interface Request {
  userId: string;
  groupId: string;
  startDate: Date;
  endDate: Date;
}

@injectable()
class GeneratePointsOfSaleReportService {
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
  }: Request): Promise<Response[]> {
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

    const days = eachDayOfInterval({
      end: endDate,
      start: startDate,
    }).length;

    const groupsReports = groups.map(async group => {
      const { pointsOfSale } = await this.pointsOfSaleRepository.find({
        by: 'groupId',
        value: group.id,
        fields: ['id', 'label', 'address'],
      });

      const reportsPromises = pointsOfSale.map(async pointOfSale => {
        const { machines } = await this.machinesRepository.find({
          pointOfSaleId: pointOfSale.id,
          fields: [
            'id',
            'serialNumber',
            'incomePerMonthGoal',
            'incomePerPrizeGoal',
          ],
        });

        const machineInfosPromises = machines.map(async machine => {
          const { telemetryLogs } = await this.telemetryLogsRepository.find({
            filters: {
              date: {
                startDate,
                endDate,
              },
              groupId,
              machineId: machine.id,
              maintenance: false,
              pointOfSaleId: pointOfSale.id,
            },
          });

          const income = telemetryLogs
            .filter(telemetryLog => telemetryLog.type === 'IN')
            .reduce((a, b) => a + b.value, 0);

          const givenPrizes = telemetryLogs
            .filter(telemetryLog => telemetryLog.type === 'OUT')
            .reduce((a, b) => a + b.value, 0);

          const plays = telemetryLogs.reduce((a, b) => a + b.numberOfPlays, 0);

          const playsPerPrize =
            givenPrizes > 0 ? Math.trunc(plays / givenPrizes) : 0;

          const averagePerDay = Math.trunc(income / days);

          const { incomePerMonthGoal } = machine;

          const { incomePerPrizeGoal } = machine;

          return {
            machine,
            income,
            givenPrizes,
            plays,
            playsPerPrize,
            averagePerDay,
            incomePerMonthGoal,
            incomePerPrizeGoal,
          };
        });

        const machineInfos = await Promise.all(machineInfosPromises);

        return {
          pointOfSale,
          machineInfos,
        };
      });

      const response = await Promise.all(reportsPromises);

      return {
        group,
        pointsOfSale: response,
      };
    });

    const response = await Promise.all(groupsReports);

    return response;
  }
}

export default GeneratePointsOfSaleReportService;

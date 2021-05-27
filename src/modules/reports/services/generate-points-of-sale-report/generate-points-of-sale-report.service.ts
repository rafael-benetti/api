import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { differenceInDays, endOfDay, startOfDay } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { Promise } from 'bluebird';
import Group from '@modules/groups/contracts/models/group';
import Address from '@modules/points-of-sale/contracts/models/address';
import MachineLogType from '@modules/machine-logs/contracts/enums/machine-log-type';
import MachineLogsRepository from '@modules/machine-logs/contracts/repositories/machine-logs.repository';

interface Response {
  label: string;
  rent: number;
  income: number;
  address: Address;
  groupLabel: string;
  machineAnalytics: {
    serialNumber: string;
    category: string;
    income: number | undefined;
    prizes: number | undefined;
    remoteCreditAmount: number | undefined;
    numberOfPlays: number | undefined;
    gameValue: number;
    playsPerPrize: number;
    incomePerPrizeGoal: number | undefined;
    incomePerMonthGoal: number | undefined;
    averagePerDay: number;
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

    @inject('MachineLogsRepository')
    private machineLogsRepository: MachineLogsRepository,
  ) {}

  async execute({
    userId,
    groupId,
    startDate,
    endDate,
  }: Request): Promise<{
    data: {
      startDate: Date;
      endDate: Date;
    };
    pointsOfSaleAnalytics: Response[];
  }> {
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

    startDate = startOfDay(startDate);
    endDate = endOfDay(endDate);

    const days =
      differenceInDays(endDate, startDate) !== 0
        ? differenceInDays(endDate, startDate)
        : 1;

    const { pointsOfSale } = await this.pointsOfSaleRepository.find({
      by: 'groupId',
      value: groupIds,
      fields: ['id', 'label', 'address', 'groupId', 'isPercentage', 'rent'],
    });

    const reportsPromises = pointsOfSale.map(async pointOfSale => {
      const { machines } = await this.machinesRepository.find({
        pointOfSaleId: pointOfSale.id,
        fields: [
          'id',
          'serialNumber',
          'incomePerMonthGoal',
          'incomePerPrizeGoal',
          'gameValue',
          'categoryLabel',
        ],
      });

      const {
        machineLogs: machinesLogs,
      } = await this.machineLogsRepository.find({
        groupId: groupIds,
        machineId: machines.map(machine => machine.id),
        endDate,
        startDate,
        type: MachineLogType.REMOTE_CREDIT,
      });

      const incomePerMachine = await this.telemetryLogsRepository.getIncomePerMachine(
        { groupIds, endDate, startDate },
      );

      const prizesPerMachine = await this.telemetryLogsRepository.getPrizesPerMachine(
        {
          endDate,
          groupIds,
          startDate,
        },
      );

      const machineAnalyticsPromises = machines.map(async machine => {
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

        const remoteCreditAmount = machinesLogs
          .filter(machineLog => machineLog.machineId === machine.id)
          .reduce((a, b) => a + b.quantity, 0);

        const income = telemetryLogs
          .filter(telemetryLog => telemetryLog.type === 'IN')
          .reduce((a, b) => a + b.value, 0);

        const prizes = prizesPerMachine.find(prizes => prizes.id === machine.id)
          ?.prizes;

        const numberOfPlays = incomePerMachine.find(
          machineIncome => machineIncome.id === machine.id,
        )?.numberOfPlays;

        const averagePerDay = Number((income / days).toFixed(2));

        const { incomePerMonthGoal } = machine;

        const { incomePerPrizeGoal } = machine;

        return {
          serialNumber: machine.serialNumber,
          category: machine.categoryLabel,
          income,
          prizes,
          remoteCreditAmount,
          numberOfPlays: numberOfPlays
            ? Number(numberOfPlays.toFixed(2))
            : numberOfPlays,
          gameValue: machine.gameValue,
          playsPerPrize:
            numberOfPlays && prizes
              ? Number((numberOfPlays / prizes).toFixed(2))
              : 0,
          incomePerMonthGoal,
          incomePerPrizeGoal,
          averagePerDay,
        };
      });

      const machineAnalytics = await Promise.all(machineAnalyticsPromises);

      const groupLabel = groups.find(group => group.id === pointOfSale.groupId)
        ?.label;

      const rent = pointOfSale.isPercentage
        ? (machineAnalytics.reduce((a, b) => a + b.income, 0) *
            pointOfSale.rent) /
          100
        : pointOfSale.rent;

      return {
        label: pointOfSale.label,
        rent,
        income: machineAnalytics.reduce((a, b) => a + b.income, 0),
        address: pointOfSale.address,
        groupLabel: groupLabel || 'Parceria Pessoal',
        machineAnalytics,
      };
    });

    const response = await Promise.all(reportsPromises);

    return {
      data: {
        startDate,
        endDate,
      },
      pointsOfSaleAnalytics: response,
    };
  }
}

export default GeneratePointsOfSaleReportService;

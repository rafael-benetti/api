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
import MachineLogsRepository from '@modules/machine-logs/contracts/repositories/machine-logs.repository';
import ExcelJS from 'exceljs';
import exportPointsOfSaleReport from './export-points-of-sale-report';

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
  download: boolean;
  pointsOfSaleIds: string[];
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
    download,
    pointsOfSaleIds,
  }: Request): Promise<
    | {
        date: {
          startDate: Date;
          endDate: Date;
        };
        pointsOfSaleAnalytics: Response[];
      }
    | ExcelJS.Workbook
  > {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    if (user.role !== Role.OWNER && !user.permissions?.generateReports)
      throw AppError.authorizationError;

    let groupIds: string[] = [];
    let groups: Group[] = [];

    if (groupId && !pointsOfSaleIds) {
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
    } else if (user.role === Role.MANAGER && !pointsOfSaleIds) {
      if (!user.groupIds) throw AppError.unknownError;
      groupIds = user.groupIds;
      groups = await this.groupsRepository.find({
        filters: {
          ids: user.groupIds,
        },
      });
    } else if (user.role === Role.OWNER && !pointsOfSaleIds) {
      groups = await this.groupsRepository.find({
        filters: {
          ownerId: user.id,
        },
        fields: ['id', 'label'],
      });

      groupIds = groups.map(group => group.id);
    }

    let pointsOfSale;
    if (pointsOfSaleIds) {
      pointsOfSale = (
        await this.pointsOfSaleRepository.find({
          by: 'id',
          value: pointsOfSaleIds,
          fields: ['id', 'label', 'address', 'groupId', 'isPercentage', 'rent'],
        })
      ).pointsOfSale;
      groupIds = [
        ...new Set(pointsOfSale.map(pointOfSale => pointOfSale.groupId)),
      ];
    } else {
      pointsOfSale = (
        await this.pointsOfSaleRepository.find({
          by: 'groupId',
          value: groupIds,
          fields: ['id', 'label', 'address', 'groupId', 'isPercentage', 'rent'],
        })
      ).pointsOfSale;
      groupIds = [
        ...new Set(pointsOfSale.map(pointOfSale => pointOfSale.groupId)),
      ];
    }

    startDate = startOfDay(startDate);
    endDate = endOfDay(endDate);

    const days =
      differenceInDays(endDate, startDate) !== 0
        ? differenceInDays(endDate, startDate)
        : 1;

    if (!pointsOfSale) {
      return {
        date: {
          startDate,
          endDate,
        },
        pointsOfSaleAnalytics: [],
      };
    }
    const machines = await this.machinesRepository.find({
      pointOfSaleId: pointsOfSale.map(pos => pos.id),
      fields: [
        'id',
        'serialNumber',
        'incomePerMonthGoal',
        'incomePerPrizeGoal',
        'gameValue',
        'categoryLabel',
        'locationId',
      ],
    });

    const reportsPromises = pointsOfSale.map(async pointOfSale => {
      const result = await this.telemetryLogsRepository.getIncomeAndPrizesPerMachine(
        {
          groupIds,
          pointOfSaleId: pointOfSale.id,
          endDate,
          startDate,
        },
      );

      const machineAnalyticsPromises = machines
        .filter(machines => machines.locationId === pointOfSale.id)
        .map(async machine => {
          const machineLogs = await this.machineLogsRepository.remoteCreditAmount(
            {
              groupId: groupIds,
              machineId: machines.map(machine => machine.id),
              startDate,
              endDate,
            },
          );

          const remoteCreditAmount = machineLogs.find(
            machineLog => machineLog.machineId === machine.id,
          )?.remoteCreditAmount;

          const income =
            result.find(income => income._id === machine.id)?.income || 0;

          const prizes =
            result.find(prizes => prizes._id === machine.id)?.numberOfPrizes ||
            0;

          const numberOfPlays = income / machine.gameValue;

          const averagePerDay = Number((income / days).toFixed(2));

          const { incomePerMonthGoal } = machine;

          const { incomePerPrizeGoal } = machine;

          return {
            serialNumber: machine.serialNumber,
            category: machine.categoryLabel,
            income: income || 0,
            prizes: prizes || 0,
            remoteCreditAmount: remoteCreditAmount || 0,
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
            averagePerDay: averagePerDay || 0,
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
        rent: rent || 0,
        income: machineAnalytics.reduce((a, b) => a + b.income, 0),
        address: pointOfSale.address,
        groupLabel: groupLabel || 'Parceria Pessoal',
        machineAnalytics,
      };
    });

    const pointsOfSaleAnalytics = await Promise.all(reportsPromises);

    if (download) {
      const Workbook = await exportPointsOfSaleReport({
        date: {
          startDate,
          endDate,
        },
        pointsOfSaleAnalytics,
      });

      return Workbook;
    }

    return {
      date: {
        startDate,
        endDate,
      },
      pointsOfSaleAnalytics,
    };
  }
}

export default GeneratePointsOfSaleReportService;

import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Period from '@modules/machines/contracts/dtos/period.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import ProductLogsRepository from '@modules/products/contracts/repositories/product-logs.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { Promise } from 'bluebird';
import {
  addHours,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  isSameDay,
  isSameHour,
  startOfDay,
  subHours,
  subMonths,
  subWeeks,
} from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  startDate?: Date;
  endDate?: Date;
  period?: Period;
}
interface ChartData1 {
  date: string;
  prizeCount: number;
  income: number;
}

interface ChartData2 {
  total: number;
  counterLabel: string;
}

interface Response {
  machinesSortedByLastCollection: Machine[];
  machinesSortedByLastConnection: Machine[];
  chartData1?: ChartData1[];
  chartData2?: ChartData2[];
  machinesSortedByStock: {
    id: string;
    serialNumber: string;
    total: number;
    minimumPrizeCount: number;
  }[];
  machinesNeverConnected: number;
  machinesWithoutTelemetryBoard: number;
  offlineMachines: number;
  onlineMachines: number;
  givenPrizesCount?: number;
  income?: number;
  group: Group;
  pointsOfSaleSortedByIncome: {
    pointOfSale: PointOfSale;
    income?: number;
  }[];
  lastPurchaseDate?: Date;
}

@injectable()
export default class DetailGroupServiceV2 {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('ProductLogsRepository')
    private productLogsRepository: ProductLogsRepository,
  ) {}

  async execute({
    userId,
    groupId,
    startDate,
    endDate,
    period,
  }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OPERATOR) throw AppError.authorizationError;

    const group = await this.groupsRepository.findOne({
      by: 'id',
      value: groupId,
    });

    if (!group) throw AppError.groupNotFound;

    if (user.role === Role.OWNER) {
      const groupIds = (
        await this.groupsRepository.find({
          filters: {
            ownerId: user.id,
          },
        })
      ).map(group => group.id);

      if (!groupIds.includes(groupId)) throw AppError.authorizationError;
    }

    if (user.role === Role.MANAGER)
      if (!user.groupIds?.includes(groupId)) throw AppError.authorizationError;

    const machinesSortedByLastCollectionPromise = this.machinesRepository.find({
      orderByLastCollection: true,
      groupIds: [groupId],
      limit: 5,
      offset: 0,
      fields: [
        'id',
        'serialNumber',
        'categoryLabel',
        'lastCollection',
        'lastConnection',
        'pointOfSaleId',
        'pointOfSale',
        'pointOfSale.label',
      ],
      populate: ['pointOfSale'],
    });

    const machinesSortedByLastConnectionPromise = this.machinesRepository.find({
      orderByLastConnection: true,
      groupIds: [groupId],
      telemetryStatus: 'OFFLINE',
      limit: 5,
      offset: 0,
      fields: [
        'id',
        'serialNumber',
        'categoryLabel',
        'lastConnection',
        'lastCollection',
        'pointOfSaleId',
        'pointOfSale',
        'pointOfSale.label',
      ],
      populate: ['pointOfSale'],
    });

    const machinesSortedByStockPromise =
      this.machinesRepository.machineSortedByStock({
        groupIds: [groupId],
      });

    const offlineMachinesPromise = this.machinesRepository.count({
      groupIds: [groupId],
      telemetryStatus: 'OFFLINE',
      checkLocationExists: true,
    });

    const onlineMachinesPromise = this.machinesRepository.count({
      groupIds: [groupId],
      telemetryStatus: 'ONLINE',
      checkLocationExists: true,
    });

    const machinesNeverConnectedPromise = this.machinesRepository.count({
      groupIds: [groupId],
      telemetryStatus: 'VIRGIN',
      checkLocationExists: true,
    });

    const machinesWithoutTelemetryBoardPromise = this.machinesRepository.count({
      groupIds: [groupId],
      telemetryStatus: 'NO_TELEMETRY',
      checkLocationExists: true,
    });

    const [
      machinesSortedByLastConnection,
      machinesSortedByStock,
      offlineMachines,
      onlineMachines,
      machinesNeverConnected,
    ] = await Promise.all([
      machinesSortedByLastConnectionPromise,
      machinesSortedByStockPromise,
      offlineMachinesPromise,
      onlineMachinesPromise,
      machinesNeverConnectedPromise,
    ]);

    const [machinesWithoutTelemetryBoard, machinesSortedByLastCollection] =
      await Promise.all([
        machinesWithoutTelemetryBoardPromise,
        machinesSortedByLastCollectionPromise,
      ]);

    if (!startDate && !endDate && !period) period = Period.DAILY;

    if (period) {
      endDate = new Date();
      if (period === Period.DAILY) {
        startDate = startOfDay(subHours(endDate, 3));
        endDate = endOfDay(subHours(endDate, 3));
      }
      if (period === Period.WEEKLY) {
        startDate = startOfDay(subWeeks(endDate, 1));
        endDate = endOfDay(subHours(endDate, 3));
      }
      if (period === Period.MONTHLY) {
        startDate = startOfDay(subMonths(endDate, 1));
        endDate = endOfDay(subHours(endDate, 3));
      }
    }

    if (!startDate) throw AppError.unknownError;
    if (!endDate) throw AppError.unknownError;

    const incomeOfPeriodPromise =
      await this.telemetryLogsRepository.getGroupIncomePerPeriod({
        groupIds: [groupId],
        type: 'IN',
        withHours: period === Period.DAILY,
        startDate,
        endDate,
      });

    const prizesOfPeriodPromise =
      await this.telemetryLogsRepository.getGroupIncomePerPeriod({
        groupIds: [groupId],
        type: 'OUT',
        withHours: period === Period.DAILY,
        startDate,
        endDate,
      });

    const chartData2Promise =
      this.telemetryLogsRepository.getIncomePerCounterType({
        groupIds: [groupId],
      });

    const [incomeOfPeriod, prizesOfPeriod, chartData2] = await Promise.all([
      incomeOfPeriodPromise,
      prizesOfPeriodPromise,
      chartData2Promise,
    ]);

    const lastPurchasePromise = this.productLogsRepository.findOne({
      filters: {
        logType: 'IN',
        groupId,
      },
    });

    // ? FATURAMENTO
    const income = incomeOfPeriod.reduce((a, b) => a + b.total, 0);

    // ? PREMIOS ENTREGUES
    const givenPrizesCount = prizesOfPeriod.reduce((a, b) => a + b.total, 0);

    let interval: Date[];

    if (period === Period.DAILY) {
      interval = eachHourOfInterval({
        start: startDate,
        end: endDate,
      }).map(item => addHours(item, 3));
    } else {
      interval = eachDayOfInterval({
        start: startDate,
        end: subHours(endDate, 4),
      }).map(item => addHours(item, 4));
    }

    const chartData1 = interval.map(item => {
      const incomeInHour =
        incomeOfPeriod.find(total =>
          period === Period.DAILY
            ? isSameHour(item, new Date(total.id))
            : isSameDay(item, new Date(total.id)),
        )?.total || 0;

      const prizesCountInHour =
        prizesOfPeriod.find(total =>
          period === Period.DAILY
            ? isSameHour(item, new Date(total.id))
            : isSameDay(item, new Date(total.id)),
        )?.total || 0;

      return {
        date: item.toISOString(),
        prizeCount: prizesCountInHour,
        income: incomeInHour,
      };
    });

    const incomePerPointOfSalePromise =
      this.telemetryLogsRepository.incomePerPointOfSale({
        groupIds: [groupId],
        endDate,
        startDate,
      });

    const pointsOfSalePromise = this.pointsOfSaleRepository.find({
      by: 'groupId',
      value: groupId,
    });

    const [{ pointsOfSale }, incomePerPointOfSale, lastPurchase] =
      await Promise.all([
        pointsOfSalePromise,
        incomePerPointOfSalePromise,
        lastPurchasePromise,
      ]);

    const pointsOfSaleSortedByIncomePromises = pointsOfSale.map(
      async pointOfSale => {
        const numberOfMachines = await this.machinesRepository.count({
          groupIds: [groupId],
          pointOfSaleId: pointOfSale.id,
        });

        return {
          pointOfSale,
          income:
            incomePerPointOfSale.find(income => income.id === pointOfSale.id)
              ?.income || 0,
          numberOfMachines,
        };
      },
    );

    const pointsOfSaleSortedByIncomeResponse = await Promise.all(
      pointsOfSaleSortedByIncomePromises,
    );

    return {
      machinesNeverConnected,
      machinesSortedByLastCollection,
      machinesSortedByLastConnection,
      machinesSortedByStock,
      machinesWithoutTelemetryBoard,
      offlineMachines,
      onlineMachines,
      givenPrizesCount,
      income,
      chartData1,
      chartData2,
      pointsOfSaleSortedByIncome: pointsOfSaleSortedByIncomeResponse,
      lastPurchaseDate: lastPurchase?.createdAt,
      group,
    };
  }
}

import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
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
import { Promise } from 'bluebird';
import { inject, injectable } from 'tsyringe';
import Period from '@modules/machines/contracts/dtos/period.dto';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';

interface Request {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  period?: Period;
  groupId?: string;
  routeId?: string;
  pointOfSaleId?: string;
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
  chartData1?: ChartData1[];
  chartData2?: ChartData2[];
  givenPrizesCount?: number;
  income?: number;
}

@injectable()
export default class DashboardInfoServiceV2 {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,
  ) {}

  async execute({
    userId,
    period,
    startDate,
    endDate,
    groupId,
    routeId,
    pointOfSaleId,
  }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const isOperator = user.role === Role.OPERATOR;

    let groupIds: string[] = [];
    let locations: string[] | undefined;

    if (user.role === Role.OWNER) {
      const ownerGroupIds = (
        await this.groupsRepository.find({
          filters: {
            ownerId: user.id,
          },
        })
      ).map(group => group.id);

      if (groupId) {
        if (ownerGroupIds.includes(groupId)) groupIds = [groupId];
        else throw AppError.authorizationError;
      } else groupIds = ownerGroupIds;
    }

    if (user.role === Role.MANAGER) {
      if (groupId) {
        if (user.groupIds?.includes(groupId)) groupIds = [groupId];
        else throw AppError.authorizationError;
      } else if (user.groupIds) {
        groupIds = user.groupIds;
      } else throw AppError.missingGroupId;
    }

    if (routeId) {
      const route = await this.routesRepository.findOne({
        id: routeId,
      });

      if (!route) throw AppError.routeNotFound;

      locations = route.pointsOfSaleIds;
    }

    if (pointOfSaleId) locations = [pointOfSaleId];

    const machinesSortedByLastCollectionPromise = this.machinesRepository.find({
      checkLocationExists: true,
      orderByLastCollection: true,
      operatorId: isOperator ? user.id : undefined,
      groupIds,
      pointOfSaleId: locations,
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
      ],
      populate: ['pointOfSale'],
    });

    const machinesSortedByLastConnectionPromise = this.machinesRepository.find({
      checkLocationExists: true,
      orderByLastConnection: true,
      pointOfSaleId: locations,
      operatorId: isOperator ? user.id : undefined,
      groupIds: isOperator ? undefined : groupIds,
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
      ],
      populate: ['pointOfSale'],
    });

    const machinesSortedByStockPromise =
      this.machinesRepository.machineSortedByStock({
        groupIds: isOperator ? undefined : groupIds,
        operatorId: isOperator ? user.id : undefined,
        pointOfSaleId: locations,
      });

    const offlineMachinesPromise = this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'OFFLINE',
      pointOfSaleId: locations,
      checkLocationExists: true,
    });

    const machinesNeverConnectedPromise = this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'VIRGIN',
      pointOfSaleId: locations,
      checkLocationExists: true,
    });

    const onlineMachinesPromise = this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'ONLINE',
      pointOfSaleId: locations,
      checkLocationExists: true,
    });

    const machinesWithoutTelemetryBoardPromise = this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'NO_TELEMETRY',
      pointOfSaleId: locations,
      checkLocationExists: true,
    });

    const [
      machinesSortedByLastCollection,
      machinesSortedByLastConnection,
      machinesSortedByStock,
      offlineMachines,
      machinesNeverConnected,
    ] = await Promise.all([
      machinesSortedByLastCollectionPromise,
      machinesSortedByLastConnectionPromise,
      machinesSortedByStockPromise,
      offlineMachinesPromise,
      machinesNeverConnectedPromise,
    ]);

    const [onlineMachines, machinesWithoutTelemetryBoard] = await Promise.all([
      onlineMachinesPromise,
      machinesWithoutTelemetryBoardPromise,
    ]);

    if (isOperator)
      return {
        machinesSortedByLastCollection,
        machinesSortedByLastConnection,
        offlineMachines,
        onlineMachines,
        machinesNeverConnected,
        machinesWithoutTelemetryBoard,
        machinesSortedByStock,
      };

    if (!startDate && !endDate && !period) period = Period.DAILY;

    if (period) {
      endDate = new Date(Date.now());
      if (period === Period.DAILY) {
        startDate = startOfDay(endDate);
        endDate = endOfDay(endDate);
      }
      if (period === Period.WEEKLY) startDate = subWeeks(endDate, 1);
      if (period === Period.MONTHLY) startDate = subMonths(endDate, 1);
    }

    if (!startDate) throw AppError.unknownError;
    if (!endDate) throw AppError.unknownError;

    let chartData1: ChartData1[] = [];
    let income: number = 0;
    let givenPrizesCount: number = 0;

    const incomeOfPeriodPromise =
      this.telemetryLogsRepository.getGroupIncomePerPeriod({
        groupIds,
        pointsOfSaleIds: locations,
        type: 'IN',
        withHours: period === Period.DAILY,
        startDate,
        endDate,
      });

    const prizesOfPeriodPromise =
      this.telemetryLogsRepository.getGroupIncomePerPeriod({
        groupIds,
        pointsOfSaleIds: locations,
        type: 'OUT',
        withHours: period === Period.DAILY,
        startDate,
        endDate,
      });

    const chartData2Promise =
      this.telemetryLogsRepository.getIncomePerCounterType({
        groupIds,
        pointsOfSaleIds: locations,
      });

    const [incomeOfPeriod, prizesOfPeriod, chartData2] = await Promise.all([
      incomeOfPeriodPromise,
      prizesOfPeriodPromise,
      chartData2Promise,
    ]);

    // ? FATURAMENTO
    income = incomeOfPeriod.reduce((a, b) => a + b.total, 0);

    // ? PREMIOS ENTREGUES
    givenPrizesCount = prizesOfPeriod.reduce((a, b) => a + b.total, 0);

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
      }).map(item => subHours(item, 4));
    }

    chartData1 = interval.map(item => {
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

    return {
      machinesSortedByLastCollection,
      machinesSortedByLastConnection,
      offlineMachines,
      onlineMachines,
      machinesNeverConnected,
      machinesWithoutTelemetryBoard,
      machinesSortedByStock,
      chartData1,
      chartData2,
      income,
      givenPrizesCount,
    };
  }
}

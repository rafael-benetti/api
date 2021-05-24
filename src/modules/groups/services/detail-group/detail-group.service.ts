import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Period from '@modules/machines/contracts/dtos/period.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import ProductLogsRepository from '@modules/products/contracts/repositories/product-logs.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import UniversalFinancialRepository from '@modules/universal-financial/contracts/repositories/universal-financial.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { Promise } from 'bluebird';
import {
  eachDayOfInterval,
  isSameDay,
  isSameHour,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  startDate: Date;
  endDate: Date;
  period: Period;
}
interface ChartData1 {
  date: string;
  prizeCount: number;
  income: number;
}

interface ChartData2 {
  cashIncome: number;
  coinIncome: number;
  creditCardIncome: number;
  others: number;
}

interface Response {
  machinesSortedByLastCollection: Machine[];
  machinesSortedByLastConnection: Machine[];
  chartData1?: ChartData1[];
  chartData2?: ChartData2;
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
export default class DetailGroupService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('UniversalFinancialRepository')
    private universalFinancialRepository: UniversalFinancialRepository,

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
      limit: 5,
      offset: 0,
      fields: [
        'id',
        'serialNumber',
        'lastConnection',
        'lastCollection',
        'pointOfSaleId',
        'pointOfSale',
        'pointOfSale.label',
      ],
      populate: ['pointOfSale'],
    });

    const machinesSortedByStockPromise = this.machinesRepository.machineSortedByStock(
      {
        groupIds: [groupId],
      },
    );

    const offlineMachinesPromise = this.machinesRepository.count({
      groupIds: [groupId],
      telemetryStatus: 'OFFLINE',
    });

    const onlineMachinesPromise = this.machinesRepository.count({
      groupIds: [groupId],
      telemetryStatus: 'ONLINE',
    });

    const machinesNeverConnectedPromise = this.machinesRepository.count({
      groupIds: [groupId],
      telemetryStatus: 'VIRGIN',
    });

    const machinesWithoutTelemetryBoardPromise = this.machinesRepository.count({
      groupIds: [groupId],
      telemetryStatus: 'NO_TELEMETRY',
    });

    const universalFinancialPromise = this.universalFinancialRepository.find({
      groupId: [groupId],
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

    const [
      machinesWithoutTelemetryBoard,
      machinesSortedByLastCollection,
      universalFinancial,
    ] = await Promise.all([
      machinesWithoutTelemetryBoardPromise,
      machinesSortedByLastCollectionPromise,
      universalFinancialPromise,
    ]);

    if (period) {
      endDate = new Date(Date.now());
      if (period === Period.DAILY) startDate = subDays(endDate, 1);
      if (period === Period.WEEKLY) startDate = subWeeks(endDate, 1);
      if (period === Period.MONTHLY) startDate = subMonths(endDate, 1);
    }

    if (!startDate) throw AppError.unknownError;
    if (!endDate) throw AppError.unknownError;

    let chartData1: ChartData1[] = [];
    let income: number = 0;
    let givenPrizesCount: number = 0;

    if (
      (period && period === Period.DAILY) ||
      eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).length <= 1 // TODO: DAR UMA CONFERIDA SE 24 O INTERVALO É 2 OU 1
    ) {
      const telemetryLogsInPromise = this.telemetryLogsRepository.find({
        filters: {
          date: {
            startDate,
            endDate,
          },
          groupId: [groupId],
          maintenance: false,
          type: 'IN',
        },
      });

      const telemetryLogsOutPromise = this.telemetryLogsRepository.find({
        filters: {
          date: {
            startDate,
            endDate,
          },
          groupId: [groupId],
          maintenance: false,
          type: 'OUT',
        },
      });

      const [telemetryLogsIn, telemetryLogsOut] = await Promise.all([
        telemetryLogsInPromise,
        telemetryLogsOutPromise,
      ]);

      const hoursOfInterval = eachDayOfInterval({
        start: startDate,
        end: endDate,
      });

      // ? FATURAMENTO
      income = telemetryLogsIn.reduce((a, b) => a + b.value, 0);

      // ? PREMIOS ENTREGUES
      givenPrizesCount = telemetryLogsOut.reduce((a, b) => a + b.value, 0);

      chartData1 = hoursOfInterval.map(hour => {
        const incomeInHour = telemetryLogsIn
          .filter(telemetry => isSameHour(hour, telemetry.date))
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0,
          );

        const prizesCountInHour = telemetryLogsOut
          .filter(telemetry => isSameHour(hour, telemetry.date))
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0,
          );

        return {
          date: hour.toISOString(),
          prizeCount: prizesCountInHour,
          income: incomeInHour,
        };
      });
    }

    if (period !== Period.DAILY) {
      // ? FATURAMENTO
      income = universalFinancial.reduce(
        (a, b) =>
          a + (b.cashIncome + b.coinIncome + b.creditCardIncome + b.others),
        0,
      );

      // ? PREMIOS ENTREGUES
      givenPrizesCount = universalFinancial.reduce(
        (a, b) => a + b.givenPrizes,
        0,
      );

      const daysOfInterval = eachDayOfInterval({
        start: startDate,
        end: endDate,
      });

      chartData1 = daysOfInterval.map(day => {
        const incomeInDay = universalFinancial
          .filter(item => isSameDay(day, item.date))
          .reduce(
            (accumulator, currentValue) =>
              accumulator +
              (currentValue.cashIncome +
                currentValue.coinIncome +
                currentValue.creditCardIncome +
                currentValue.others),
            0,
          );

        const prizesCountInDay = universalFinancial
          .filter(item => isSameDay(day, item.date))
          .reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.givenPrizes,
            0,
          );

        return {
          date: day.toISOString(),
          prizeCount: prizesCountInDay,
          income: incomeInDay,
        };
      });
    }

    let cashIncome = 0;
    let coinIncome = 0;
    let creditCardIncome = 0;
    let others = 0;

    universalFinancial.forEach(item => {
      cashIncome += item.cashIncome;
      coinIncome += item.coinIncome;
      creditCardIncome += item.creditCardIncome;
      others += item.others;
    });

    const lastPurchasePromise = this.productLogsRepository.findOne({
      filters: {
        logType: 'IN',
        groupId,
      },
    });

    const incomePerPointOfSalePromise = this.telemetryLogsRepository.incomePerPointOfSale(
      {
        groupIds: [groupId],
        endDate,
        startDate,
      },
    );

    const pointsOfSalePromise = this.pointsOfSaleRepository.find({
      by: 'groupId',
      value: groupId,
    });

    const [
      { pointsOfSale },
      incomePerPointOfSale,
      lastPurchase,
    ] = await Promise.all([
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
          income: incomePerPointOfSale.find(
            income => income.id === pointOfSale.id,
          )?.income,
          numberOfMachines,
        };
      },
    );

    const pointsOfSaleSortedByIncomeResponse = await Promise.all(
      pointsOfSaleSortedByIncomePromises,
    );

    const chartData2 = {
      cashIncome,
      coinIncome,
      creditCardIncome,
      others,
    };

    return {
      machinesNeverConnected,
      machinesSortedByLastCollection: machinesSortedByLastCollection.machines,
      machinesSortedByLastConnection: machinesSortedByLastConnection.machines,
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

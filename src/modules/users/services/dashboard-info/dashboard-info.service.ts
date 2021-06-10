import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import {
  eachDayOfInterval,
  eachHourOfInterval,
  isSameDay,
  isSameHour,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { Promise } from 'bluebird';
import { inject, injectable } from 'tsyringe';
import Period from '@modules/machines/contracts/dtos/period.dto';
import UniversalFinancialRepository from '@modules/universal-financial/contracts/repositories/universal-financial.repository';
import UniversalFinancial from '@modules/universal-financial/contracts/entities/universal-financial';

interface Request {
  userId: string;
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
  chartData2?: ChartData2;
  givenPrizesCount?: number;
  income?: number;
}

@injectable()
export default class DashboardInfoService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('UniversalFinancialRepository')
    private universalFinancialRepository: UniversalFinancialRepository,
  ) {}

  async execute({
    userId,
    period,
    startDate,
    endDate,
  }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const isOperator = user.role === Role.OPERATOR;

    let groupIds: string[] = [];

    if (user.role === Role.OWNER)
      groupIds = (
        await this.groupsRepository.find({
          filters: {
            ownerId: user.id,
          },
        })
      ).map(group => group.id);

    const machinesSortedByLastCollection = (
      await this.machinesRepository.find({
        orderByLastCollection: true,
        operatorId: isOperator ? user.id : undefined,
        groupIds,
        limit: 5,
        offset: 0,
        fields: [
          'id',
          'serialNumber',
          'lastCollection',
          'lastConnection',
          'pointOfSaleId',
          'pointOfSale',
        ],
        populate: ['pointOfSale'],
      })
    ).machines;

    const machinesSortedByLastConnection = (
      await this.machinesRepository.find({
        orderByLastConnection: true,
        operatorId: isOperator ? user.id : undefined,
        groupIds: isOperator ? undefined : groupIds,
        limit: 5,
        offset: 0,
        fields: [
          'id',
          'serialNumber',
          'lastConnection',
          'lastCollection',
          'pointOfSaleId',
          'pointOfSale',
        ],
        populate: ['pointOfSale'],
      })
    ).machines;

    const machinesSortedByStock = await this.machinesRepository.machineSortedByStock(
      {
        groupIds: isOperator ? undefined : groupIds,
        operatorId: isOperator ? user.id : undefined,
      },
    );

    const offlineMachines = await this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'OFFLINE',
    });

    const onlineMachines = await this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'ONLINE',
    });

    const machinesNeverConnected = await this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'VIRGIN',
    });

    const machinesWithoutTelemetryBoard = await this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'NO_TELEMETRY',
    });

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

    if (!isOperator)
      if (period && period === Period.DAILY) {
        const telemetryLogsInPromise = this.telemetryLogsRepository.find({
          filters: {
            date: {
              startDate,
              endDate,
            },
            groupId: groupIds,
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
            groupId: groupIds,
            maintenance: false,
            type: 'OUT',
          },
        });

        const [telemetryLogsIn, telemetryLogsOut] = await Promise.all([
          telemetryLogsInPromise,
          telemetryLogsOutPromise,
        ]);

        const hoursOfInterval = eachHourOfInterval({
          start: startDate,
          end: endDate,
        });

        // ? FATURAMENTO
        income = telemetryLogsIn.reduce((a, b) => a + b.value, 0);

        // ? PREMIOS ENTREGUES
        givenPrizesCount = telemetryLogsOut.reduce((a, b) => a + b.value, 0);

        if (!isOperator)
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

    let universalFinancial: UniversalFinancial[] = [];
    if (!isOperator)
      universalFinancial = await this.universalFinancialRepository.find({
        groupId: groupIds,
        date: {
          end: endDate,
          start: startDate,
        },
      });

    if (!isOperator)
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

    return {
      machinesSortedByLastCollection,
      machinesSortedByLastConnection,
      offlineMachines,
      onlineMachines,
      machinesNeverConnected,
      machinesWithoutTelemetryBoard,
      machinesSortedByStock,
      chartData1,
      chartData2: {
        cashIncome,
        coinIncome,
        creditCardIncome,
        others,
      },
      income,
      givenPrizesCount,
    };
  }
}

import Period from '@modules/machines/contracts/dtos/period.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';

import Role from '@modules/users/contracts/enums/role';
import User from '@modules/users/contracts/models/user';
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
import { injectable, inject } from 'tsyringe';

interface Request {
  period: Period;
  userId: string;
  routeId: string;
  startDate: Date;
  endDate: Date;
}

interface ChartData {
  date: string;
  prizeCount: number;
  income: number;
}

interface ChartData2 {
  pointOfSaleId: string;
  label: string;
  income: number;
  givenPrizesCount: number;
}

interface Response {
  operator: User | undefined;
  route: Route;
  pointsOfSale: PointOfSale[];
  income: number;
  givenPrizesCount: number;
  chartData1: ChartData[];
  chartData2: ChartData2[];
  machines: Machine[];
}

@injectable()
class DetailRouteService {
  constructor(
    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,
  ) {}

  public async execute({
    userId,
    routeId,
    period,
    endDate,
    startDate,
  }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const route = await this.routesRepository.findOne({
      id: routeId,
    });

    if (!route) throw AppError.routeNotFound;

    if (user.role === Role.OPERATOR && route?.operatorId !== user.id)
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER) {
      const checkRoutesGroups = route?.groupIds.some(
        groupId => !user.groupIds?.includes(groupId),
      );

      if (checkRoutesGroups) throw AppError.authorizationError;
    }

    if (user.role === Role.OWNER && user.id !== route.ownerId)
      throw AppError.authorizationError;

    const { pointsOfSale } = await this.pointsOfSaleRepository.find({
      by: 'routeId',
      value: route.id,
      populate: ['group'],
    });

    let operator;

    if (route.operatorId)
      operator = await this.usersRepository.findOne({
        by: 'id',
        value: route.operatorId,
        fields: [
          'name',
          'groupIds',
          'email',
          'role',
          'groupIds',
          'permissions',
        ],
      });

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
    const telemetryLogs = await this.telemetryLogsRepository.find({
      filters: {
        routeId,
        date: {
          startDate: addHours(startDate, 3),
          endDate: addHours(endDate, 3),
        },
      },
    });

    const telemetryLogsIn = telemetryLogs.filter(
      telemetryLog => telemetryLog.type === 'IN',
    );

    const telemetryLogsOut = telemetryLogs.filter(
      telemetryLog => telemetryLog.type === 'OUT',
    );

    // ? FATURAMENTO
    const income = telemetryLogsIn.reduce((a, b) => a + b.value, 0);

    // ? PREMIOS ENTREGUES
    const givenPrizesCount = telemetryLogsOut.reduce((a, b) => a + b.value, 0);

    let chartData1: ChartData[] = [];

    // ? CHART DATA PARA O PERIODO DIARIO
    if (period && period === Period.DAILY) {
      const hoursOfInterval = eachHourOfInterval({
        start: startDate,
        end: endDate,
      }).map(item => addHours(item, 3));

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

    // ? MACHINES ORDERED
    const machines = await this.machinesRepository.find({
      pointOfSaleId: pointsOfSale.map(pointOfSale => pointOfSale.id),
      orderByLastCollection: true,
      checkLastCollectionExists: false,
      fields: [
        'pointOfSale',
        'pointOfSale.label',
        'serialNumber',
        'categoryLabel',
        'lastCollection',
        'id',
      ],
    });

    // ? CHART DATA PARA PERIODO SEMANAL E MENSAL
    if (period === Period.MONTHLY || period === Period.WEEKLY) {
      const daysOfInterval = eachDayOfInterval({
        start: startDate,
        end: subHours(endDate, 4),
      }).map(item => addHours(item, 4));

      chartData1 = daysOfInterval.map(day => {
        const incomeInDay = telemetryLogsIn
          .filter(telemetry => isSameDay(day, telemetry.date))
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0,
          );

        const prizesCountInDay = telemetryLogsOut
          .filter(telemetry => isSameDay(day, telemetry.date))
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0,
          );

        return {
          date: day.toISOString(),
          prizeCount: prizesCountInDay,
          income: incomeInDay,
        };
      });
    }

    const chartData2 = pointsOfSale.map(pointOfSale => {
      const telemetryLogsOfPointOfSaleIn = telemetryLogsIn.filter(
        telemetryLogIn => telemetryLogIn.pointOfSaleId === pointOfSale.id,
      );

      const telemetryLogsOfPointOfSaleOut = telemetryLogsOut.filter(
        telemetryLogOut => telemetryLogOut.pointOfSaleId === pointOfSale.id,
      );

      const income = telemetryLogsOfPointOfSaleIn.reduce(
        (a, b) => a + b.value,
        0,
      );

      const givenPrizesCount = telemetryLogsOfPointOfSaleOut.reduce(
        (a, b) => a + b.value,
        0,
      );

      return {
        pointOfSaleId: pointOfSale.id,
        label: pointOfSale.label,
        income,
        givenPrizesCount,
      };
    });

    return {
      // TODO TIRAR A SENHA DO CABLOCO
      operator,
      route,
      pointsOfSale,
      income,
      givenPrizesCount,
      chartData1,
      chartData2,
      machines,
    };
  }
}
export default DetailRouteService;

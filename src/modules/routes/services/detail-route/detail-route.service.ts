import Period from '@modules/machines/contracts/dtos/period.dto';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
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
import { injectable, inject } from 'tsyringe';

interface Request {
  period: Period;
  userId: string;
  routeId: string;
}

interface ChartData {
  date: string;
  prizeCount: number;
  income: number;
}

interface Response {
  route: Route;
  pointsOfSale: PointOfSale[];
  income: number;
  givenPrizesCount: number;
  chartData1: ChartData[];
  chartData2: { pointOfSaleId: string; label: string; income: number }[];
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
  ) {}

  public async execute({
    userId,
    routeId,
    period,
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
    });

    const endDate = new Date(Date.now());
    let startDate;
    if (period === Period.DAILY) startDate = subDays(endDate, 1);
    if (period === Period.WEEKLY) startDate = subWeeks(endDate, 1);
    if (period === Period.MONTHLY) startDate = subMonths(endDate, 1);

    if (startDate === undefined) throw AppError.unknownError;

    const telemetryLogs = await this.telemetryLogsRepository.find({
      filters: {
        pointOfSaleId: pointsOfSale.map(pointOfSale => pointOfSale.id),
        date: {
          startDate,
          endDate,
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
    if (period === Period.DAILY) {
      const hoursOfInterval = eachHourOfInterval({
        start: startDate,
        end: endDate,
      });

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

    // ? CHART DATA PARA PERIODO SEMANAL E MENSAL
    if (period === Period.MONTHLY || period === Period.WEEKLY) {
      const daysOfInterval = eachDayOfInterval({
        start: startDate,
        end: endDate,
      });

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
      const telemetryLogsOfPointOfSale = telemetryLogsIn.filter(
        telemetryLogIn => telemetryLogIn.pointOfSaleId === pointOfSale.id,
      );

      const income = telemetryLogsOfPointOfSale.reduce(
        (a, b) => a + b.value,
        0,
      );

      return {
        pointOfSaleId: pointOfSale.id,
        label: pointOfSale.label,
        income,
      };
    });

    return {
      route,
      pointsOfSale,
      income,
      givenPrizesCount,
      chartData1,
      chartData2,
    };
  }
}
export default DetailRouteService;

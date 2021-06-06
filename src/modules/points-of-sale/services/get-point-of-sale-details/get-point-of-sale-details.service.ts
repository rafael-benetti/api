import Period from '@modules/machines/contracts/dtos/period.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
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
  endOfDay,
  isSameDay,
  isSameHour,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  pointOfSaleId: string;
  period: Period;
  startDate: Date;
  endDate: Date;
}

interface MachineInfo {
  machine: Machine;
  income: number;
  givenPrizes: number;
}

interface ChartData {
  date: string;
  prizeCount: number;
  income: number;
}

interface Response {
  pointOfSale: PointOfSale;
  machinesInfo: MachineInfo[];
  route?: Route;
  chartData: ChartData[];
  income: number;
  givenPrizesCount: number;
}

@injectable()
class GetPointOfSaleDetailsService {
  constructor(
    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,
  ) {}

  public async execute({
    userId,
    pointOfSaleId,
    period,
    startDate,
    endDate,
  }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const pointOfSale = await this.pointsOfSaleRepository.findOne({
      by: 'id',
      value: pointOfSaleId,
      populate: ['group'],
    });

    if (!pointOfSale) throw AppError.pointOfSaleNotFound;

    if (user.role === Role.OWNER && user.id !== pointOfSale.ownerId)
      throw AppError.authorizationError;

    if (
      (user.role === Role.MANAGER || user.role === Role.OPERATOR) &&
      !user.groupIds?.includes(pointOfSale.groupId)
    )
      throw AppError.authorizationError;

    const { machines } = await this.machinesRepository.find({
      pointOfSaleId,
      isActive: true,
    });

    let route;
    if (pointOfSale.routeId) {
      route = await this.routesRepository.findOne({
        id: pointOfSale.routeId,
      });
    }

    if (period) {
      endDate = new Date(Date.now());
      if (period === Period.DAILY) startDate = subDays(endDate, 1);
      if (period === Period.WEEKLY) startDate = subWeeks(endDate, 1);
      if (period === Period.MONTHLY) startDate = subMonths(endDate, 1);
    }

    if (!startDate) throw AppError.unknownError;
    if (!endDate) throw AppError.unknownError;

    if (period !== Period.DAILY) {
      startDate = startOfDay(startDate);
      endDate = endOfDay(endDate);
    }

    const telemetryLogs = await this.telemetryLogsRepository.getPointOfSaleIncomePerDate(
      {
        endDate,
        pointOfSaleId,
        startDate,
        withHours: false,
      },
    );

    const telemetryLogsIn = telemetryLogs.filter(
      telemetryLog => telemetryLog.id.type === 'IN',
    );

    const telemetryLogsOut = telemetryLogs.filter(
      telemetryLog => telemetryLog.id.type === 'OUT',
    );

    // ? FATURAMENTO
    const income = telemetryLogsIn.reduce((a, b) => a + b.total, 0);

    // ? PREMIOS ENTREGUES
    const givenPrizesCount = telemetryLogsOut.reduce((a, b) => a + b.total, 0);

    let chartData: ChartData[] = [];

    // ? CHART DATA PARA O PERIODO DIARIO
    if (period && period === Period.DAILY) {
      const hoursOfInterval = eachHourOfInterval({
        start: startDate,
        end: endDate,
      });

      chartData = hoursOfInterval.map(hour => {
        const incomeInHour =
          telemetryLogsIn
            .filter(telemetry => isSameHour(hour, new Date(telemetry.id.date)))
            .reduce((a, b) => a + b.total, 0) || 0;

        const prizesCountInHour =
          telemetryLogsOut
            .filter(telemetry => isSameHour(hour, new Date(telemetry.id.date)))
            .reduce((a, b) => a + b.total, 0) || 0;

        return {
          date: hour.toISOString(),
          prizeCount: prizesCountInHour,
          income: incomeInHour,
        };
      });
    }

    // ? CHART DATA PARA PERIODO SEMANAL E MENSAL
    if (period !== Period.DAILY) {
      const daysOfInterval = eachDayOfInterval({
        start: startDate,
        end: endDate,
      });

      chartData = daysOfInterval.map(day => {
        const incomeInDay =
          telemetryLogsIn
            .filter(telemetry => isSameDay(day, new Date(telemetry.id.date)))
            .reduce((a, b) => a + b.total, 0) || 0;

        const prizesCountInDay =
          telemetryLogsOut
            .filter(telemetry => isSameDay(day, new Date(telemetry.id.date)))
            .reduce((a, b) => a + b.total, 0) || 0;

        return {
          date: day.toISOString(),
          prizeCount: prizesCountInDay,
          income: incomeInDay,
        };
      });
    }

    const machinesInfo = machines.map(machine => {
      return {
        machine,
        income: telemetryLogsIn
          .filter(telemetryLog => telemetryLog.id.machineId === machine.id)
          .reduce((a, b) => a + b.total, 0),
        givenPrizes: telemetryLogsOut
          .filter(telemetryLog => telemetryLog.id.machineId === machine.id)
          .reduce((a, b) => a + b.total, 0),
      };
    });

    return {
      pointOfSale,
      machinesInfo,
      route,
      chartData,
      givenPrizesCount,
      income,
    };
  }
}
export default GetPointOfSaleDetailsService;

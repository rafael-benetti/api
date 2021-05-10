import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Period from '@modules/machines/contracts/dtos/period.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
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
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId: string;
  period: Period;
}

interface ChartData {
  date: string;
  prizeCount: number;
  income: number;
}

interface BoxInfo {
  boxId: string;
  currentMoney: number;
  currentPrizeCount: number;
  givenPrizes: number;
}

interface Response {
  machine: Machine;
  lastConnection?: Date;
  lastCollection?: Date;
  income: number;
  givenPrizes: number;
  chartData: ChartData[];
  boxesInfo: BoxInfo[];
  transactionHistory: TelemetryLog[];
}

@injectable()
class GetMachineDetailsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('CollectionsRepository')
    private collectionsRepository: CollectionsRepository,

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    userId,
    machineId,
    period,
  }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    // TODO: VERIFICAR SE ELE É UM OPERADOR PARA LIMITAR ALGUMAS

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
      populate: ['telemetryBoard', 'operator', 'group', 'pointOfSale'],
    });

    if (!machine) throw AppError.machineNotFound;

    if (user.role === Role.OWNER && machine.ownerId !== user.id)
      throw AppError.authorizationError;

    if (user.role === Role.OPERATOR && machine.operatorId !== user.id)
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER && !user.groupIds?.includes(machine.groupId))
      throw AppError.authorizationError;

    // ? ULTIMA COLETA
    const lastCollection = (
      await this.collectionsRepository.findLastCollection(machineId)
    )?.date;

    const telemetryLogs = await this.telemetryLogsRepository.find({
      filters: {
        machineId,
        maintenance: false,
        date: {
          startDate: lastCollection,
          endDate: new Date(Date.now()),
        },
      },
    });

    const endDate = new Date(Date.now());
    let startDate;
    if (period === Period.DAILY) startDate = subDays(endDate, 1);
    if (period === Period.WEEKLY) startDate = subWeeks(endDate, 1);
    if (period === Period.MONTHLY) startDate = subMonths(endDate, 1);

    if (startDate === undefined) throw AppError.unknownError;

    const telemetryLogsOfPeriod = await this.telemetryLogsRepository.find({
      filters: {
        machineId,
        date: {
          startDate,
          endDate,
        },
        maintenance: false,
      },
    });

    const telemetryLogsOfPeriodIn = telemetryLogsOfPeriod.filter(
      telemetryLog => telemetryLog.type === 'IN',
    );

    const telemetryLogsOfPeriodOut = telemetryLogsOfPeriod.filter(
      telemetryLog => telemetryLog.type === 'OUT',
    );

    const telemetryLogsOut = telemetryLogs.filter(
      telemetryLog => telemetryLog.type === 'OUT',
    );

    const counterTypes = await this.counterTypesRepository.find({
      ownerId: user.role === Role.OWNER ? user.id : user.ownerId,
    });

    // ? ULTIMA COMUNICAÇÃO
    const lastConnection = telemetryLogs[0]?.date
      ? telemetryLogs[0].date
      : undefined;

    // ? FATURAMENTO
    const income = telemetryLogsOfPeriodIn.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );

    // ? PREMIOS ENTREGUES
    const givenPrizes = telemetryLogsOfPeriodOut.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );

    // ? PREMIOS DISPONIVEIS POR GABINE
    const boxesInfo: BoxInfo[] = machine.boxes.map(boxe => {
      // * INFORMAÇÃO DE UMA GABINE
      let givenPrizesCount = 0;
      boxe.counters.forEach(counter => {
        const counterType = counterTypes.find(
          counterType => counterType.id === counter.counterTypeId,
        )?.type;

        if (counterType === 'OUT') {
          const counterLogs = telemetryLogsOut.filter(telemetryLog => {
            return (
              telemetryLog.pin?.toString() === counter.pin?.replace('Pino ', '')
            );
          });
          givenPrizesCount += counterLogs.reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0,
          );
        }
      });

      return {
        boxId: boxe.id,
        givenPrizes: givenPrizesCount,
        currentMoney: boxe.currentMoney,
        currentPrizeCount: boxe.numberOfPrizes,
      };
    });

    let chartData: ChartData[] = [];

    // ? CHART DATA PARA O PERIODO DIARIO
    if (period === Period.DAILY) {
      const hoursOfInterval = eachHourOfInterval({
        start: startDate,
        end: endDate,
      });

      chartData = hoursOfInterval.map(hour => {
        const incomeInHour = telemetryLogsOfPeriodIn
          .filter(telemetry => isSameHour(hour, telemetry.date))
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0,
          );

        const prizesCountInHour = telemetryLogsOfPeriodOut
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

      chartData = daysOfInterval.map(day => {
        const incomeInDay = telemetryLogsOfPeriodIn
          .filter(telemetry => isSameDay(day, telemetry.date))
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0,
          );

        const prizesCountInDay = telemetryLogsOfPeriodOut
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

    // ? HISTORICO DE EVENTOS
    const transactionHistory = await this.telemetryLogsRepository.find({
      filters: {},
      limit: 5,
    });

    return {
      machine,
      income,
      lastCollection,
      lastConnection,
      boxesInfo,
      givenPrizes,
      chartData,
      transactionHistory,
    };
  }
}
export default GetMachineDetailsService;

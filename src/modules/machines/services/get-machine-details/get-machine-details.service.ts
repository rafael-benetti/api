import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import MachineLog from '@modules/machine-logs/contracts/entities/machine-log';
import MachineLogsRepository from '@modules/machine-logs/contracts/repositories/machine-logs.repository';
import Period from '@modules/machines/contracts/dtos/period.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';
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
  machineId: string;
  period: Period;
  startDate: Date;
  endDate: Date;
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
  collectedBy?: string;
  income: number;
  givenPrizes: number;
  chartData: ChartData[];
  boxesInfo: BoxInfo[];
  transactionHistory: TelemetryLog[];
  machineLogs: MachineLog[];
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

    @inject('MachineLogsRepository')
    private machineLogsRepository: MachineLogsRepository,
  ) {}

  public async execute({
    userId,
    machineId,
    period,
    startDate,
    endDate,
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
    const lastCollectionData =
      await this.collectionsRepository.findLastCollection(machineId);

    let lastCollection;
    let collectedBy;

    if (lastCollectionData) {
      lastCollection = lastCollectionData?.date;
      collectedBy = (
        await this.usersRepository.findOne({
          by: 'id',
          value: lastCollectionData?.userId,
        })
      )?.name;
    }

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

    if (period !== Period.DAILY) {
      startDate = startOfDay(startDate);
      endDate = endOfDay(endDate);
    }

    const machineIncomePerDayPromise =
      this.telemetryLogsRepository.getMachineIncomePerDay({
        machineId,
        startDate: addHours(startDate, 3),
        endDate: addHours(endDate, 3),
        groupIds: [machine.groupId],
        withHours: period === Period.DAILY,
      });

    const machineGivenPrizesPerDayPromise =
      this.telemetryLogsRepository.getMachineGivenPrizesPerDay({
        machineId,
        startDate: addHours(startDate, 3),
        endDate: addHours(endDate, 3),
        groupIds: [machine.groupId],
        withHours: period === Period.DAILY,
      });

    const machineGivenPrizesPerPinPromise =
      this.telemetryLogsRepository.getMachineGivenPrizesPerDay({
        machineId,
        startDate: machine.lastCollection,
        endDate: new Date(),
        groupIds: [machine.groupId],
        withHours: false,
      });

    // ? HISTORICO DE JOGADAS
    const transactionHistoryPromise = await this.telemetryLogsRepository.find({
      filters: {
        machineId,
        groupId: machine.groupId,
      },
      limit: 5,
    });

    // ? HISTORICO DE EVENTOS
    const machineLogsPromise = this.machineLogsRepository.find({
      machineId,
      limit: 5,
      offset: 0,
      groupId: machine.groupId,
      populate: ['user'],
      fields: [
        'user.name',
        'id',
        'machineId',
        'groupId',
        'observations',
        'type',
        'createdAt',
        'createdBy',
        'quantity',
      ],
    });

    const [
      machineIncomePerDay,
      machineGivenPrizesPerDay,
      machineLogs,
      transactionHistory,
      machineGivenPrizesPerPin,
    ] = await Promise.all([
      machineIncomePerDayPromise,
      machineGivenPrizesPerDayPromise,
      machineLogsPromise,
      transactionHistoryPromise,
      machineGivenPrizesPerPinPromise,
    ]);

    const counterTypes = await this.counterTypesRepository.find({
      ownerId: user.role === Role.OWNER ? user.id : user.ownerId,
    });

    // ? ULTIMA COMUNICAÇÃO
    const { lastConnection } = machine;

    // ? FATURAMENTO
    const income = machineIncomePerDay.reduce((a, b) => a + b.income, 0);

    // ? PREMIOS ENTREGUES
    const givenPrizes = machineGivenPrizesPerDay.reduce(
      (a, b) => a + b.givenPrizes,
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
          givenPrizesCount = machineGivenPrizesPerPin
            .filter(givenPrizeOfDay => {
              return (
                givenPrizeOfDay.id.pin?.toString() ===
                counter.pin?.replace('Pino ', '')
              );
            })
            .reduce((a, b) => a + b.givenPrizes, 0);
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
    if (period && period === Period.DAILY) {
      const hoursOfInterval = eachHourOfInterval({
        start: startDate,
        end: endDate,
      }).map(item => addHours(item, 3));

      chartData = hoursOfInterval.map(hour => {
        const incomeInHour =
          machineIncomePerDay.find(telemetry =>
            isSameHour(hour, new Date(telemetry.id)),
          )?.income || 0;

        const prizesCountInHour =
          machineGivenPrizesPerDay.find(telemetry =>
            isSameHour(hour, new Date(telemetry.id.date)),
          )?.givenPrizes || 0;

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
        end: subHours(endDate, 4),
      }).map(item => addHours(item, 4));

      chartData = daysOfInterval.map(day => {
        const incomeInDay =
          machineIncomePerDay.find(telemetry =>
            isSameDay(day, new Date(telemetry.id)),
          )?.income || 0;

        const prizesCountInDay =
          machineGivenPrizesPerDay.find(telemetry =>
            isSameDay(day, new Date(telemetry.id.date)),
          )?.givenPrizes || 0;

        return {
          date: day.toISOString(),
          prizeCount: prizesCountInDay,
          income: incomeInDay,
        };
      });
    }

    return {
      machine,
      income,
      lastCollection,
      lastConnection,
      boxesInfo,
      givenPrizes,
      chartData,
      transactionHistory,
      machineLogs,
      collectedBy,
    };
  }
}
export default GetMachineDetailsService;

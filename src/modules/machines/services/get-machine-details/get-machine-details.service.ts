import logger from '@config/logger';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { eachHourOfInterval, isSameHour, startOfDay } from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId: string;
}

interface ChartData {
  [key: string]: {
    prizeCount: number;
    income: number;
  }[];
}

interface BoxInfo {
  currentMoney: number;
  currentPrizeCount: number;
  givenPrizes: number;
}

interface Response {
  lastConnection?: Date;
  lastCollection?: Date;
  income: number;
  givenPrizes: number;
  chartData: ChartData;
  boxesInfo: BoxInfo[];
  transctionHistory: TelemetryLog[];
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

  public async execute({ userId, machineId }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
    });

    if (!machine) throw AppError.machineNotFound;

    if (user.role === Role.OWNER && machine.ownerId !== user.id)
      throw AppError.authorizationError;

    if (user.role === Role.OPERATOR && machine.operatorId !== user.id)
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER && !user.groupIds?.includes(machine.groupId))
      throw AppError.authorizationError;

    const endDate = new Date(Date.now());
    const startDate = startOfDay(endDate);

    logger.info(endDate);
    logger.info(startDate);

    const telemetryLogs = await this.telemetryLogsRepository.find({
      filters: {
        machineId,

        maintenance: false,
      },
    });

    logger.info('a');

    const telemetryLogsIn = telemetryLogs.filter(
      telemetryLog => telemetryLog.type === 'IN',
    );

    const telemetryLogsOut = telemetryLogs.filter(
      telemetryLog => telemetryLog.type === 'OUT',
    );

    const counterTypes = await this.counterTypesRepository.find({
      ownerId: user.role === Role.OWNER ? user.id : user.ownerId,
    });

    // ? ULTIMA COMUNICAÇÃO
    const lastConnection = telemetryLogs[0].date;

    // ? ULTIMA COLETA
    const lastCollection = (
      await this.collectionsRepository.findLastCollection(machineId)
    )?.date;

    // ? FATURAMENTO
    const income = telemetryLogsIn.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );

    // ? PREMIOS ENTREGUES
    const givenPrizes = telemetryLogsOut.reduce(
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
            logger.info(
              telemetryLog.pin.toString(),
              counter.pin?.replace('Pino ', ''),
            );
            return (
              telemetryLog.pin.toString() === counter.pin?.replace('Pino ', '')
            );
          });
          givenPrizesCount += counterLogs.reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            0,
          );
        }
      });

      //* currentMoney: number;
      //* currentPrizeCount: number;
      //* givenPrizes: number;

      return {
        givenPrizes: givenPrizesCount,
        currentMoney: boxe.currentMoney,
        currentPrizeCount: boxe.numberOfPrizes,
      };
    });

    const hoursOfInterval = eachHourOfInterval({
      start: startDate,
      end: endDate,
    });
    // ? { [x: number]: { prizesCount: number; income: number; }; }[]
    // ? { [x: number]: { prizesCount: number; income: number; }; }[]

    const chartData: ChartData = hoursOfInterval.map((hour: ChartData) => {
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
        [hour.getHours()]: {
          prizesCount: prizesCountInHour,
          income: incomeInHour,
        },
      };
    });

    return {
      income,
      lastCollection,
      lastConnection,
      boxesInfo,
      givenPrizes,
      chartData,
      transctionHistory: [],
    };

    // TODO: TOTAL DE PREMIOS NAS GABINES DE SAIDA

    // TODO: INFORMAÇÕES DO GRAFICO SENDO ELAS: DIARIO(24HRS), SEMANAL(ULTIMAS 7 DIAS) E MENSAL(ULTIMOS 30 DIAS)

    // TODO: ESTOQUE NAS GABINES

    // TODO: HISTORICO DE EVENTOS
  }
}
export default GetMachineDetailsService;

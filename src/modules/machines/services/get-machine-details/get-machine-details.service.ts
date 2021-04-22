import logger from '@config/logger';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { startOfDay, startOfMonth, sub, subMonths } from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId: string;
}

interface Response {}

interface BoxeInfo {
  credit?: number;
  prizes?: number;
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

  public async execute({ userId, machineId }: Request): Promise<Machine> {
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
    const startDate = startOfDay(subMonths(endDate, 1));

    const telemetryLogs = await this.telemetryLogsRepository.find({
      filters: {
        machineId,
        date: {
          startDate,
          endDate,
        },
        maintenance: false,
      },
    });

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
    const lastCommunication = telemetryLogs[0].date;

    // ? ULTIMA COLETA
    const lastCollect = (
      await this.collectionsRepository.findLastCollection(machineId)
    )?.date;

    // ? FATURAMENTO
    const income = telemetryLogsIn.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );

    // ? PREMIOS ENTREGUES
    const prizes = telemetryLogsOut.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );

    // ? CREDITOS DISPONIVEIS POR GABINE
    const boxesInfos = machine.boxes.map(boxe => {
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

      return { givenPrizesCount };
    });

    // TODO: TOTAL DE PREMIOS NAS GABINES DE SAIDA

    // TODO: INFORMAÇÕES DO GRAFICO SENDO ELAS: DIARIO(24HRS), SEMANAL(ULTIMAS 7 DIAS) E MENSAL(ULTIMOS 30 DIAS)

    // TODO: ESTOQUE NAS GABINES

    // TODO: HISTORICO DE EVENTOS
  }
}
export default GetMachineDetailsService;

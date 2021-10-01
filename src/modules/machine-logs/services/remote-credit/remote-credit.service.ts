import LogType from '@modules/logs/contracts/enums/log-type.enum';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import MachineLogType from '@modules/machine-logs/contracts/enums/machine-log-type';
import MachineLogsRepository from '@modules/machine-logs/contracts/repositories/machine-logs.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import MqttProvider from '@providers/mqtt-provider/contracts/models/mqtt-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId: string;
  observations: string;
  quantity: number;
}

@injectable()
export default class RemoteCreditService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('MachineLogsRepository')
    private machineLogsRepository: MachineLogsRepository,

    @inject('MqttProvider')
    private mqttProvider: MqttProvider,

    @inject('LogsRepository')
    private logsRepository: LogsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    machineId,
    observations,
    quantity,
  }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.addRemoteCredit)
      throw AppError.authorizationError;

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
    });

    if (!machine) throw AppError.machineNotFound;

    if (!machine.telemetryBoardId) throw AppError.telemetryBoardNotFound;

    const payload = {
      type: 'remoteCredit',
      credit: quantity,
    };

    this.mqttProvider.publish({
      topic: `sub/${machine.telemetryBoardId}`,
      payload: JSON.stringify(payload),
    });

    this.machineLogsRepository.create({
      createdBy: user.id,
      groupId: machine.groupId,
      machineId: machine.id,
      observations,
      type: MachineLogType.REMOTE_CREDIT,
      quantity: Number(quantity),
    });

    this.logsRepository.create({
      createdBy: user.id,
      groupId: machine.groupId,
      ownerId: machine.ownerId,
      type: LogType.REMOTE_CREDIT,
      machineId: machine.id,
      quantity: Number(quantity),
    });

    await this.ormProvider.commit();
  }
}

import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId: string;
  limit: number;
  offset: number;
}

@injectable()
class ListTelemetryLogsService {
  constructor(
    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute({
    userId,
    machineId,
    limit,
    offset,
  }: Request): Promise<TelemetryLog[]> {
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

    if (user.role === Role.OPERATOR && machine.operatorId !== user.id)
      throw AppError.authorizationError;
    else if (user.role === Role.OWNER && machine.ownerId !== user.id)
      throw AppError.authorizationError;
    else if (
      user.role === Role.MANAGER &&
      !user.groupIds?.includes(machine.groupId)
    )
      throw AppError.authorizationError;

    const telemetryLogs = await this.telemetryLogsRepository.find({
      filters: {
        machineId,
      },
      limit,
      offset,
    });

    return telemetryLogs;
  }
}
export default ListTelemetryLogsService;

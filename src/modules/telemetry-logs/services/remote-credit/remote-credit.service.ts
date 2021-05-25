import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import MqttProvider from '@providers/mqtt-provider/contracts/models/mqtt-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId: string;
}

@injectable()
export default class RemoteCreditService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('MqttProvider')
    private mqttProvider: MqttProvider,
  ) {}

  async execute({ userId, machineId }: Request): Promise<void> {
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

    const payload = {
      type: 'remoteCredit',
      credit: 1,
    };

    this.mqttProvider.publish({
      topic: `sub/${machine.id}`,
      payload: JSON.stringify(payload),
    });
  }
}

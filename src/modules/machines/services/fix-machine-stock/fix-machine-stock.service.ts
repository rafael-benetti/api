import MachineLogType from '@modules/machine-logs/contracts/enums/machine-log-type';
import MachineLogsRepository from '@modules/machine-logs/contracts/repositories/machine-logs.repository';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId: string;
  boxId: string;
  quantity: number;
  observations: string;
}

@injectable()
class FixMachineStockService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('MachineLogsRepository')
    private machineLogsRepository: MachineLogsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    machineId,
    boxId,
    quantity,
    observations,
  }: Request): Promise<Machine> {
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

    const universe = await getGroupUniverse(user);
    if (
      !isInGroupUniverse({
        universe,
        groups: [machine.groupId],
        method: 'INTERSECTION',
      })
    )
      throw AppError.authorizationError;

    const box = machine.boxes.find(box => box.id === boxId);

    if (!box) throw AppError.boxNotFound;

    box.numberOfPrizes = quantity;

    this.machinesRepository.save(machine);

    this.machineLogsRepository.create({
      createdAt: new Date(),
      createdBy: user.id,
      machineId: machine.id,
      groupId: machine.groupId,
      observations,
      type: MachineLogType.FIX_STOCK,
    });
    await this.ormProvider.commit();

    return machine;
  }
}

export default FixMachineStockService;

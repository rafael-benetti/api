import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId: string;
}

@injectable()
class DeleteMachineService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ userId, machineId }: Request): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER) {
      if (user.role === Role.MANAGER) {
        if (user.ownerId === undefined) throw AppError.authorizationError;

        if (!user.permissions?.deleteMachines)
          throw AppError.authorizationError;
      }
    }

    const machine = await this.machinesRepository.findOne({
      filters: { _id: machineId },
    });

    if (!machine) throw AppError.machineNotFound;

    if (!user.groupIds?.includes(machine.groupId))
      throw AppError.authorizationError;

    this.machinesRepository.delete(machine);

    await this.ormProvider.commit();
  }
}

export default DeleteMachineService;

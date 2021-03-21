import logger from '@config/logger';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListMachinesService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute(userId: string): Promise<Machine[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OWNER) {
      const machines = await this.machinesRepository.find({
        ownerId: user.id,
      });

      return machines;
    }

    if (user.role === Role.MANAGER) {
      const machines = await this.machinesRepository.find({
        groupIds: user.groupIds,
      });

      return machines;
    }

    if (user.role === Role.OPERATOR) {
      const machines = await this.machinesRepository.find({
        operatorId: user.id,
      });

      return machines;
    }

    return [];
  }
}
export default ListMachinesService;

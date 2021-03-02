import MachineCategory from '@modules/machine-categories/contracts/models/machine-category';
import MachineCategoriesRepository from '@modules/machine-categories/contracts/repositories/machine-categories-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListMachineCategoriesService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: MachineCategoriesRepository,
  ) {}

  public async execute(userId: string): Promise<MachineCategory[]> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    const ownerId = user.role === Role.OWNER ? user._id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const machineCategories = await this.machineCategoriesRepository.findByOwnerId(
      ownerId,
    );

    return machineCategories;
  }
}
export default ListMachineCategoriesService;

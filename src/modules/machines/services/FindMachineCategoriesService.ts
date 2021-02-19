import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import MachineCategory from '../infra/typeorm/entities/MachineCategory';
import IMachineCategoriesRepository from '../repositories/IMachineCategoriesRepository';

@injectable()
class FindMachineCategoriesService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: IMachineCategoriesRepository,
  ) {}

  public async execute(userId: number): Promise<MachineCategory[]> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    const machineCategories = await this.machineCategoriesRepository.listAllCategories(
      user.ownerId,
    );

    return machineCategories;
  }
}

export default FindMachineCategoriesService;

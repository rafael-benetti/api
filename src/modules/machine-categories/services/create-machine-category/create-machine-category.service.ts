import MachineCategory from '@modules/machine-categories/contracts/models/machine-category';
import MachineCategoriesRepository from '@modules/machine-categories/contracts/repositories/machine-categories-repository';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  label: string;
}

@injectable()
class CreateMachineCategoryService {
  constructor(
    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: MachineCategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute({ userId, label }: Request): Promise<MachineCategory> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;
  }
}
export default CreateMachineCategoryService;

import MachineCategory from '@modules/machine-categories/contracts/models/machine-category';
import MachineCategoriesRepository from '@modules/machine-categories/contracts/repositories/machine-categories-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineCategoryId: string;
  label?: string;
}

@injectable()
class EditMachineCategoryService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: MachineCategoriesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    machineCategoryId,
    label,
  }: Request): Promise<MachineCategory> {
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER) {
      if (user.role === Role.MANAGER) {
        if (user.ownerId === undefined) throw AppError.authorizationError;

        if (!user.permissions?.editCategories)
          throw AppError.authorizationError;
      }
    }

    const machineCategory = await this.machineCategoriesRepository.findOne({
      filters: {
        _id: machineCategoryId,
      },
    });

    if (!machineCategory) throw AppError.machineCategoryNotFound;

    if (label) machineCategory.label = label;

    this.machineCategoriesRepository.save(machineCategory);

    await this.ormProvider.commit();

    return machineCategory;
  }
}

export default EditMachineCategoryService;

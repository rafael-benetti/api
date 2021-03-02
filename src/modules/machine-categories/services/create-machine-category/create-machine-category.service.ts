import MachineCategory from '@modules/machine-categories/contracts/models/machine-category';
import MachineCategoriesRepository from '@modules/machine-categories/contracts/repositories/machine-categories-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
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

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({ userId, label }: Request): Promise<MachineCategory> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    const ownerId = user.role === Role.OWNER ? user._id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const checkLabelAlreadyExists = await this.machineCategoriesRepository.findOne(
      {
        filters: {
          label,
          ownerId,
        },
      },
    );

    if (checkLabelAlreadyExists) throw AppError.labelAlreadyInUsed;

    const machineCategory = this.machineCategoriesRepository.create({
      label,
      ownerId,
    });

    await this.ormProvider.commit();

    return machineCategory;
  }
}
export default CreateMachineCategoryService;

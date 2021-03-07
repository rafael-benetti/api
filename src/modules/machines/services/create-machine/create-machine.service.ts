import MachineCategoriesRepository from '@modules/machine-categories/contracts/repositories/machine-categories-repository';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  categoryId: string;
  groupId: string;
  pointOfSaleId?: string;
  serialNumber: string;
}

@injectable()
class CreateMachineService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: MachineCategoriesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    serialNumber,
    categoryId,
    groupId,
    pointOfSaleId,
    userId,
  }: Request): Promise<Machine> {
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER) {
      if (user.role === Role.MANAGER) {
        if (user.ownerId === undefined) throw AppError.authorizationError;

        if (!user.permissions?.createMachines)
          throw AppError.authorizationError;

        if (!user.groupIds?.includes(groupId))
          throw AppError.authorizationError;
      }
    }

    const ownerId = user.role === Role.OWNER ? user._id : user.ownerId;

    if (!ownerId) throw AppError.authorizationError;

    const serialNumberInUse = await this.machinesRepository.findOne({
      filters: {
        ownerId,
        serialNumber,
      },
    });

    if (serialNumberInUse) throw AppError.serialNumberAlreadyUsed;

    const machineCategory = await this.machineCategoriesRepository.findOne({
      filters: {
        _id: categoryId,
        ownerId,
      },
    });

    if (!machineCategory) throw AppError.machineCategoryNotFound;

    const machine = this.machinesRepository.create({
      categoryId,
      groupId,
      ownerId,
      serialNumber,
      pointOfSaleId,
    });

    await this.ormProvider.commit();

    return machine;
  }
}
export default CreateMachineService;

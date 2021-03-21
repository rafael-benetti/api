import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import Box from '@modules/machines/contracts/models/box';
import Counter from '@modules/machines/contracts/models/counter';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  categoryId: string;
  boxes: Box[];
  // telemetryId: string; //TODO
  groupId: string;
  serialNumber: string;
  gameValue: number;
  operatorId: string;
  locationId: string;
}

@injectable()
class CreateMachineService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,

    @inject('CategoriesRepository')
    private categoriesRepository: CategoriesRepository,
  ) {}

  public async execute({
    userId,
    categoryId,
    boxes,
    gameValue,
    groupId,
    locationId,
    operatorId,
    serialNumber,
  }: Request): Promise<Machine> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && user.role !== Role.MANAGER)
      throw AppError.authorizationError;

    const checkMachineExists = await this.machinesRepository.findOne({
      by: 'serialNumber',
      value: serialNumber,
    });

    if (checkMachineExists) throw AppError.labelAlreadyInUsed;

    if (user.role === Role.MANAGER) {
      if (!user.permissions?.createMachines) throw AppError.authorizationError;
      if (!user.groupIds?.includes(groupId)) throw AppError.authorizationError;
    }

    const ownerId = user.role === Role.OWNER ? user.id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const entityBoxes = boxes.map(box => {
      const counters = box.counters.map(counter => new Counter(counter));
      return new Box({ id: box.id, counters });
    });

    const category = await this.categoriesRepository.findOne({
      by: 'id',
      value: categoryId,
    });

    if (!category) throw AppError.machineCategoryNotFound;

    const machine = this.machinesRepository.create({
      boxes: entityBoxes,
      categoryId: category.id,
      gameValue,
      groupId,
      locationId,
      operatorId,
      ownerId,
      serialNumber,
      categoryLabel: category.label,
    });

    await this.ormProvider.commit();

    return machine;
  }
}
export default CreateMachineService;

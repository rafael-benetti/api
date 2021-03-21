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
  machineId: string;
  boxes: Box[];
  gameValue: number;
  categoryId: string;
  groupId: string;
  locationId: string;
  operatorId: string;
  serialNumber: string;
}

@injectable()
class EditMachineService {
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
    boxes,
    categoryId,
    gameValue,
    groupId,
    locationId,
    machineId,
    operatorId,
    serialNumber,
    userId,
  }: Request): Promise<Machine> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (
      user.role !== Role.MANAGER &&
      user.role !== Role.OWNER &&
      user.role !== Role.OPERATOR
    )
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER || user.role === Role.OPERATOR) {
      if (!user.permissions?.editMachines) throw AppError.authorizationError;
    }

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
    });

    if (!machine) throw AppError.machineNotFound;

    if (user.role === Role.OWNER)
      if (user.id !== machine.ownerId) throw AppError.authorizationError;

    if (serialNumber) machine.serialNumber = serialNumber;

    if (operatorId) machine.operatorId = operatorId;

    machine.locationId = locationId;

    if (gameValue) machine.gameValue = gameValue;

    if (groupId) machine.groupId = groupId;

    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        by: 'id',
        value: categoryId,
      });

      if (!category) throw AppError.machineCategoryNotFound;

      machine.categoryId = category.id;
      machine.categoryLabel = category.label;
    }

    if (boxes) {
      machine.boxes = boxes.map(box => {
        const counters = box.counters.map(counter => new Counter(counter));
        return new Box({ id: box.id, counters });
      });
    }

    this.machinesRepository.save(machine);

    await this.ormProvider.commit();

    return machine;
  }
}
export default EditMachineService;

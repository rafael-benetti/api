import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import LogType from '@modules/logs/contracts/enums/log-type.enum';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  productId: string;
  machineId: string;
  boxId: string;
  toGroup: boolean;
  quantity: number;
}

@injectable()
export default class RemoveFromMachineService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('LogsRepository')
    private logsRepository: LogsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    productId,
    machineId,
    boxId,
    toGroup,
    quantity,
  }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
    });

    if (!machine) throw AppError.machineNotFound;

    const universe = await getGroupUniverse(user);
    if (
      !isInGroupUniverse({
        universe,
        groups: [machine.groupId],
        method: 'INTERSECTION',
      })
    )
      throw AppError.authorizationError;

    const box = machine.boxes.find(box => box.id === boxId);

    if (!box) throw AppError.boxNotFound;

    box.numberOfPrizes -= quantity;

    const group = await this.groupsRepository.findOne({
      by: 'id',
      value: machine.groupId,
    });

    if (!group) throw AppError.groupNotFound;

    const product = group.stock.prizes.find(
      product => product.id === productId,
    );

    if (!product) throw AppError.productNotFound;

    if (toGroup) {
      product.quantity += quantity;

      this.groupsRepository.save(group);
    } else {
      const userProduct = user.stock?.prizes.find(
        product => product.id === productId,
      );

      if (!userProduct) {
        user.stock?.prizes.push({
          id: product.id,
          label: product.label,
          quantity,
        });
      } else {
        userProduct.quantity += quantity;
      }

      this.usersRepository.save(user);
    }

    this.logsRepository.create({
      createdBy: user.id,
      ownerId: user.ownerId || user.id,
      groupId: machine.groupId,
      type: LogType.REMOVE_STOCK_FROM_MACHINE,
      machineId: machine.id,
      quantity,
    });

    await this.ormProvider.commit();
  }
}

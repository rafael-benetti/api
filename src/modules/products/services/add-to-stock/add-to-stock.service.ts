import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import LogType from '@modules/logs/contracts/enums/log-type.enum';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import ProductLogsRepository from '@modules/products/contracts/repositories/product-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  productId: string;
  type: 'PRIZE' | 'SUPPLY';
  quantity: number;
  cost: number;
}

@injectable()
class AddToStockService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('ProductLogsRepository')
    private productLogsRepository: ProductLogsRepository,

    @inject('LogsRepository')
    private logsRepository: LogsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    groupId,
    productId,
    type,
    quantity,
    cost,
  }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.editProducts)
      throw AppError.authorizationError;

    const universe = await getGroupUniverse(user);

    if (
      !isInGroupUniverse({
        groups: [groupId],
        universe,
        method: 'INTERSECTION',
      })
    )
      throw AppError.authorizationError;

    const group = await this.groupsRepository.findOne({
      by: 'id',
      value: groupId,
    });

    if (!group) throw AppError.groupNotFound;

    const product =
      type === 'PRIZE'
        ? group.stock.prizes.find(p => p.id === productId)
        : group.stock.supplies.find(p => p.id === productId);

    if (!product) throw AppError.productNotFound;

    product.quantity += quantity;

    this.productLogsRepository.create({
      cost,
      groupId,
      productName: product.label,
      productType: type,
      quantity,
      logType: 'IN',
    });

    this.groupsRepository.save(group);

    if (quantity < 0) {
      this.logsRepository.create({
        createdBy: user.id,
        ownerId: user.ownerId || user.id,
        type: LogType.REMOVE_STOCK_FROM_GROUP,
        quantity: quantity * -1,
        groupId: group.id,
        productName: product.label,
      });
    } else {
      this.logsRepository.create({
        createdBy: user.id,
        ownerId: user.ownerId || user.id,
        type: LogType.ADD_TO_STOCK,
        quantity,
        groupId: group.id,
        productName: product.label,
      });
    }

    await this.ormProvider.commit();
  }
}

export default AddToStockService;

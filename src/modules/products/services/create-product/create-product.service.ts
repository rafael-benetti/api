import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import LogType from '@modules/logs/contracts/enums/log-type.enum';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import ProductLogsRepository from '@modules/products/contracts/repositories/product-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import Product from '@modules/users/contracts/models/product';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
import { inject, injectable } from 'tsyringe';
import { v4 } from 'uuid';

interface Request {
  userId: string;
  groupId: string;
  label: string;
  type: 'PRIZE' | 'SUPPLY';
  quantity: number;
  cost: number;
}

@injectable()
class CreateProductService {
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
    label,
    type,
    quantity,
    cost,
  }: Request): Promise<Product> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.createProducts)
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

    const product = {
      id: v4(),
      label,
      quantity,
    };

    this.productLogsRepository.create({
      productName: label,
      groupId,
      quantity,
      cost,
      productType: type,
      logType: 'IN',
    });

    if (type === 'PRIZE') group.stock.prizes.push(product);
    else group.stock.supplies.push(product);

    this.groupsRepository.save(group);

    this.logsRepository.create({
      createdBy: user.id,
      groupId: group.id,
      ownerId: group.ownerId,
      type: LogType.CREATE_STOCK,
      productName: product.label,
      quantity: product.quantity,
    });

    await this.ormProvider.commit();

    return product;
  }
}

export default CreateProductService;

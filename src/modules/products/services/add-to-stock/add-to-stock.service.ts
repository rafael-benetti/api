import logger from '@config/logger';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
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

    // TODO create log with quantity * cost
    logger.info(cost * quantity);
    this.groupsRepository.save(group);

    await this.ormProvider.commit();
  }
}

export default AddToStockService;

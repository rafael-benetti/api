import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  targetGroupId: string;
  productId: string;
  quantity: number;
}

@injectable()
class TransferProductService {
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
    targetGroupId,
    productId,
    quantity,
  }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OPERATOR) throw AppError.authorizationError;

    if (user.role === Role.MANAGER && !user.permissions?.transferProducts)
      throw AppError.authorizationError;

    if (
      user.role === Role.MANAGER &&
      (!user.groupIds?.includes(groupId) ||
        !user.groupIds?.includes(targetGroupId))
    )
      throw AppError.authorizationError;

    const group = await this.groupsRepository.findOne({
      filters: {
        _id: groupId,
      },
    });

    if (!group) throw AppError.groupNotFound;

    const product = group.stock.find(product => product._id === productId);

    if (!product) throw AppError.productNotFound;

    if (product.quantity < quantity) throw AppError.insufficientProducts;

    const targetGroup = await this.groupsRepository.findOne({
      filters: {
        _id: targetGroupId,
      },
    });

    if (!targetGroup) throw AppError.groupNotFound;

    product.quantity -= quantity;

    const targetProduct = targetGroup.stock.find(
      product => product._id === productId,
    );

    if (!targetProduct) {
      const tmp = product;

      tmp.quantity = quantity;

      targetGroup.stock.push(tmp);
    } else {
      targetProduct.quantity += quantity;
    }

    this.groupsRepository.save(group);
    this.groupsRepository.save(targetGroup);

    await this.ormProvider.commit();
  }
}

export default TransferProductService;

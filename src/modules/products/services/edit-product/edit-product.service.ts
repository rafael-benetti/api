import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import Product from '@modules/products/contracts/models/product';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  productId: string;
  label?: string;
  quantityDifference?: number;
}

@injectable()
class EditProductService {
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
    label,
    quantityDifference,
  }: Request): Promise<Product> {
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OPERATOR) throw AppError.authorizationError;

    if (user.role === Role.MANAGER && !user.permissions?.editProducts)
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER && !user.groupIds?.includes(groupId))
      throw AppError.authorizationError;

    const group = await this.groupsRepository.findOne({
      filters: {
        _id: groupId,
      },
    });

    if (!group) throw AppError.groupNotFound;

    const product = group.stock.find(product => product._id === productId);

    if (!product) throw AppError.productNotFound;

    if (label) product.label = label;
    if (quantityDifference) product.quantity += quantityDifference;

    this.groupsRepository.save(group);

    await this.ormProvider.commit();

    return product;
  }
}

export default EditProductService;

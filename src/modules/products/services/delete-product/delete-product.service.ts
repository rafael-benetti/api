import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import Product from '@modules/users/contracts/models/product';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  productType: 'PRIZE' | 'SUPPLY';
  productId: string;
  from: {
    type: 'GROUP' | 'USER';
    id: string;
  };
}

@injectable()
class DeleteProductService {
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
    productType,
    productId,
    from,
  }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.deleteProducts)
      throw AppError.authorizationError;

    let product: Product | undefined;

    if (from.type === 'USER') {
      if (productType === 'PRIZE') {
        product = user.stock?.prizes.find(p => p.id === productId);

        if (!product) throw AppError.productNotFound;

        if (product.quantity !== 0) throw AppError.productInStock;

        const index = user.stock?.prizes.indexOf(product);

        user.stock?.prizes.splice(index as number, 1);
      } else {
        product = user.stock?.supplies.find(p => p.id === productId);

        if (!product) throw AppError.productNotFound;

        if (product.quantity !== 0) throw AppError.productInStock;

        const index = user.stock?.supplies.indexOf(product);

        user.stock?.supplies.splice(index as number, 1);
      }

      this.usersRepository.save(user);
    }

    if (from.type === 'GROUP') {
      const universe = await getGroupUniverse(user);

      if (
        !isInGroupUniverse({
          groups: [from.id],
          universe,
          method: 'INTERSECTION',
        })
      )
        throw AppError.authorizationError;

      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: from.id,
      });

      if (!group) throw AppError.groupNotFound;

      if (productType === 'PRIZE') {
        product = group.stock?.prizes.find(p => p.id === productId);

        if (!product) throw AppError.productNotFound;

        if (product.quantity !== 0) throw AppError.productInStock;

        const index = group.stock?.prizes.indexOf(product);

        group.stock?.prizes.splice(index as number, 1);
      } else {
        product = group.stock?.supplies.find(p => p.id === productId);

        if (!product) throw AppError.productNotFound;

        if (product.quantity !== 0) throw AppError.productInStock;

        const index = group.stock?.supplies.indexOf(product);

        group.stock?.supplies.splice(index as number, 1);
      }

      this.groupsRepository.save(group);
    }

    await this.ormProvider.commit();
  }
}

export default DeleteProductService;

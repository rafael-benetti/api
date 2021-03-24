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
  groupId?: string;
  productId: string;
  productType: 'PRIZE' | 'SUPPLY';
  productQuantity: number;
  to: {
    id: string;
    type: 'GROUP' | 'USER';
  };
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
    productId,
    productType,
    productQuantity,
    to,
  }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const universe = await getGroupUniverse(user);
    let originProduct;
    let destinationProduct;

    if (groupId) {
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

      originProduct =
        productType === 'PRIZE'
          ? group.stock.prizes.find(p => p.id === productId)
          : group.stock.supplies.find(p => p.id === productId);

      if (!originProduct) throw AppError.productNotFound;

      if (originProduct.quantity < productQuantity)
        throw AppError.insufficientProducts;

      originProduct.quantity -= productQuantity;

      this.groupsRepository.save(group);
    } else {
      if (user.role === Role.OWNER) throw AppError.missingGroupId;

      originProduct =
        productType === 'PRIZE'
          ? user.stock?.prizes.find(p => p.id === productId)
          : user.stock?.supplies.find(p => p.id === productId);

      if (!originProduct) throw AppError.productNotFound;

      if (originProduct.quantity < productQuantity)
        throw AppError.insufficientProducts;

      originProduct.quantity -= productQuantity;

      this.usersRepository.save(user);
    }

    if (to.type === 'GROUP') {
      if (
        !isInGroupUniverse({
          groups: [to.id],
          universe,
          method: 'INTERSECTION',
        })
      )
        throw AppError.authorizationError;

      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: to.id,
      });

      if (!group) throw AppError.groupNotFound;

      destinationProduct =
        productType === 'PRIZE'
          ? group.stock.prizes.find(p => p.id === productId)
          : group.stock.supplies.find(p => p.id === productId);

      if (!destinationProduct) {
        if (productType === 'PRIZE') {
          group.stock.prizes.push({
            ...originProduct,
            quantity: productQuantity,
          });
        } else {
          group.stock.supplies.push({
            ...originProduct,
            quantity: productQuantity,
          });
        }
      } else {
        destinationProduct.quantity += productQuantity;
      }

      this.groupsRepository.save(group);
    } else {
      const user = await this.usersRepository.findOne({
        by: 'id',
        value: to.id,
      });

      if (!user) throw AppError.userNotFound;

      if (
        !isInGroupUniverse({
          groups: user.groupIds || [],
          universe,
          method: 'INTERSECTION',
        })
      )
        throw AppError.authorizationError;

      destinationProduct =
        productType === 'PRIZE'
          ? user.stock?.prizes.find(p => p.id === productId)
          : user.stock?.supplies.find(p => p.id === productId);

      if (!destinationProduct) {
        if (productType === 'PRIZE') {
          user.stock?.prizes.push({
            ...originProduct,
            quantity: productQuantity,
          });
        } else {
          user.stock?.supplies.push({
            ...originProduct,
            quantity: productQuantity,
          });
        }
      } else {
        destinationProduct.quantity += productQuantity;
      }

      this.usersRepository.save(user);
    }

    await this.ormProvider.commit();
  }
}

export default TransferProductService;

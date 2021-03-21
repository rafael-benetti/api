import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import Prize from '@modules/users/contracts/models/prize';
import Supply from '@modules/users/contracts/models/supply';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  from: {
    groupId?: string;
    productId: string;
    productType: 'PRIZE' | 'SUPPLY';
    quantity: number;
    cost: number;
  };
  to: {
    groupId?: string;
    userId?: string;
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

  async execute({ userId, from, to }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (from.groupId && to.groupId) {
      if (
        user.role !== Role.OWNER &&
        (!user.groupIds?.includes(from.groupId) ||
          !user.groupIds.includes(to.groupId))
      )
        throw AppError.authorizationError;

      const fromGroup = await this.groupsRepository.findOne({
        by: 'id',
        value: from.groupId,
      });

      if (!fromGroup) throw AppError.groupNotFound;

      const toGroup = await this.groupsRepository.findOne({
        by: 'id',
        value: to.groupId,
      });

      if (!toGroup) throw AppError.groupNotFound;

      const fromProduct =
        from.productType === 'PRIZE'
          ? fromGroup.stock.prizes.find(p => p.id === from.productId)
          : fromGroup.stock.supplies.find(p => p.id === from.productId);

      if (!fromProduct) throw AppError.productNotFound;

      if (fromProduct.quantity < from.quantity)
        throw AppError.insufficientProducts;

      fromProduct.quantity -= from.quantity;

      this.groupsRepository.save(fromGroup);

      const toProduct =
        from.productType === 'PRIZE'
          ? toGroup.stock.prizes.find(p => p.id === from.productId)
          : toGroup.stock.supplies.find(p => p.id === from.productId);

      if (toProduct) {
        toProduct.quantity += from.quantity;
      } else {
        const newProduct = {
          id: fromProduct.id,
          label: fromProduct.label,
          quantity: from.quantity,
        } as Prize | Supply;

        if (from.productType === 'PRIZE') {
          toGroup.stock.prizes.push(newProduct);
        } else {
          toGroup.stock.supplies.push(newProduct);
        }
      }

      this.groupsRepository.save(toGroup);
    }

    await this.ormProvider.commit();
  }
}

export default TransferProductService;

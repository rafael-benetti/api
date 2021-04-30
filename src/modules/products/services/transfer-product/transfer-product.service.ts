import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import ProductLogsRepository from '@modules/products/contracts/repositories/product-logs.repository';
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
  productQuantity: number;
  cost?: number;
  from: {
    type: 'GROUP' | 'USER';
    id: string;
  };
  to: {
    type: 'GROUP' | 'USER' | 'MACHINE';
    id: string;
    boxId?: string;
  };
}

@injectable()
class TransferProductService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('ProductLogsRepository')
    private productLogsRepository: ProductLogsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    productType,
    productId,
    productQuantity,
    cost,
    from,
    to,
  }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    let fromProduct: Product | undefined;
    let toProduct: Product | undefined;

    if (from.type === 'USER') {
      if (productType === 'PRIZE') {
        fromProduct = user.stock?.prizes.find(p => p.id === productId);
      } else {
        fromProduct = user.stock?.supplies.find(p => p.id === productId);
      }

      if (!fromProduct) throw AppError.productNotFound;

      if (productQuantity > fromProduct.quantity)
        throw AppError.insufficientProducts;

      fromProduct.quantity -= productQuantity;

      this.usersRepository.save(user);
    }

    if (from.type === 'GROUP') {
      const groupUniverse = await getGroupUniverse(user);

      if (
        !isInGroupUniverse({
          universe: groupUniverse,
          groups: [from.id],
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
        fromProduct = group.stock.prizes.find(p => p.id === productId);
      } else {
        fromProduct = group.stock.supplies.find(p => p.id === productId);
      }

      if (!fromProduct) throw AppError.productNotFound;

      if (productQuantity > fromProduct.quantity)
        throw AppError.insufficientProducts;

      fromProduct.quantity -= productQuantity;

      this.groupsRepository.save(group);
    }

    if (to.type === 'USER') {
      const toUser = await this.usersRepository.findOne({
        by: 'id',
        value: to.id,
      });

      if (!toUser) throw AppError.userNotFound;

      if (user.role === Role.OPERATOR && toUser.role === Role.OPERATOR)
        throw AppError.noTransfersBetweenOperators;

      const groupUniverse = await getGroupUniverse(user);

      if (
        !isInGroupUniverse({
          universe: groupUniverse,
          groups: toUser.groupIds || [],
          method: 'INTERSECTION',
        })
      )
        throw AppError.authorizationError;

      if (productType === 'PRIZE') {
        toProduct = toUser.stock?.prizes.find(p => p.id === productId);

        if (!toProduct) {
          toUser.stock?.prizes.push({
            ...(fromProduct as Product),
            quantity: productQuantity,
          });
        } else {
          toProduct.quantity += productQuantity;
        }
      } else {
        toProduct = toUser.stock?.supplies.find(p => p.id === productId);

        if (!toProduct) {
          toUser.stock?.supplies.push({
            ...(fromProduct as Product),
            quantity: productQuantity,
          });
        } else {
          toProduct.quantity += productQuantity;
        }
      }

      this.usersRepository.save(toUser);
    }

    if (to.type === 'GROUP') {
      const groupUniverse = await getGroupUniverse(user);

      if (
        !isInGroupUniverse({
          universe: groupUniverse,
          groups: [to.id],
          method: 'INTERSECTION',
        })
      )
        throw AppError.authorizationError;

      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: to.id,
      });

      if (!group) throw AppError.groupNotFound;

      if (productType === 'PRIZE') {
        toProduct = group.stock?.prizes.find(p => p.id === productId);

        if (!toProduct) {
          group.stock?.prizes.push({
            ...(fromProduct as Product),
            quantity: productQuantity,
          });
        } else {
          toProduct.quantity += productQuantity;
        }
      } else {
        toProduct = group.stock?.supplies.find(p => p.id === productId);

        if (!toProduct) {
          group.stock?.supplies.push({
            ...(fromProduct as Product),
            quantity: productQuantity,
          });
        } else {
          toProduct.quantity += productQuantity;
        }
      }

      this.groupsRepository.save(group);
    }

    if (to.type === 'MACHINE') {
      const machine = await this.machinesRepository.findOne({
        by: 'id',
        value: to.id,
      });

      if (!machine) throw AppError.machineNotFound;

      if (!machine) throw AppError.machineNotFound;

      if (user.role === Role.OPERATOR) {
        if (machine.operatorId !== user.id) throw AppError.authorizationError;
      } else {
        const groupUniverse = await getGroupUniverse(user);

        if (
          !isInGroupUniverse({
            universe: groupUniverse,
            groups: [machine.groupId],
            method: 'INTERSECTION',
          })
        )
          throw AppError.authorizationError;
      }

      const box = machine.boxes.find(box => box.id === to.boxId);

      if (!box) throw AppError.boxNotFound;

      box.numberOfPrizes += productQuantity;

      this.machinesRepository.save(machine);
    }

    if (from.type === 'GROUP' && to.type === 'GROUP') {
      this.productLogsRepository.create({
        cost: cost || 0,
        groupId: from.id,
        productName: (fromProduct as Product).label,
        productType,
        quantity: productQuantity,
        logType: 'OUT',
      });

      this.productLogsRepository.create({
        cost: cost || 0,
        groupId: to.id,
        productName: (fromProduct as Product).label,
        productType,
        quantity: productQuantity,
        logType: 'IN',
      });
    }

    await this.ormProvider.commit();
  }
}

export default TransferProductService;

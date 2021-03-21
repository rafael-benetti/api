import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import Prize from '@modules/users/contracts/models/prize';
import Supply from '@modules/users/contracts/models/supply';
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
}

@injectable()
class CreateProductService {
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
    label,
    type,
  }: Request): Promise<Supply | Prize> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const groupUniverse = await getGroupUniverse(user);

    if (
      (user.role !== Role.OWNER && !user.permissions?.createProducts) ||
      !isInGroupUniverse([groupId], groupUniverse)
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
      quantity: 0,
    };

    if (type === 'PRIZE') group.stock.prizes.push(product);
    else group.stock.prizes.push(product);

    this.groupsRepository.save(group);

    await this.ormProvider.commit();

    return product;
  }
}

export default CreateProductService;

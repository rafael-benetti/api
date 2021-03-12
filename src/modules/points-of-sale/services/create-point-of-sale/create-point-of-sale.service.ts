import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Address from '@modules/points-of-sale/contracts/models/address';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  label: string;
  contactName: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  rent: number;
  isPercentage: boolean;
  address: Address;
}

@injectable()
class CreatePointOfSaleService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    groupId,
    label,
    contactName,
    primaryPhoneNumber,
    secondaryPhoneNumber,
    rent,
    isPercentage,
    address,
  }: Request): Promise<PointOfSale> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (
      user.role !== Role.OWNER &&
      (!user.permissions?.createPointsOfSale ||
        !user.groupIds?.includes(groupId))
    )
      throw AppError.authorizationError;

    const group = await this.groupsRepository.findOne({
      by: 'id',
      value: groupId,
    });

    if (!group) throw AppError.groupNotFound;

    const pointOfSale = this.pointsOfSaleRepository.create({
      ownerId: user.ownerId || user.id,
      groupId,
      label,
      contactName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      rent,
      isPercentage,
      address,
    });

    await this.ormProvider.commit();

    return pointOfSale;
  }
}

export default CreatePointOfSaleService;

import logger from '@config/logger';
import Address from '@modules/points-of-sale/contracts/models/address';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  label: string;
  contactName: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  address: Address;
  groupId: string;
  routeId?: string; // TODO: Verificar se é obrigatorio.
}

@injectable()
class CreatePointOfSaleService {
  constructor(
    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    label,
    contactName,
    primaryPhoneNumber,
    secondaryPhoneNumber,
    address,
    groupId,
    routeId,
  }: Request): Promise<PointOfSale> {
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER) {
      if (user.role === Role.MANAGER) {
        if (user.ownerId === undefined) throw AppError.authorizationError;

        if (!user.permissions?.createPointsOfSale)
          throw AppError.authorizationError;

        if (!user.groupIds?.includes(groupId))
          throw AppError.authorizationError;
      }
    }

    const checkLabelAlreadyExists = await this.pointsOfSaleRepository.findOne({
      filters: { label, groupId },
    });

    logger.info(checkLabelAlreadyExists);

    if (checkLabelAlreadyExists) throw AppError.labelAlreadyInUsed;

    const pointOfSale = this.pointsOfSaleRepository.create({
      address,
      contactName,
      label,
      ownerId: user.ownerId ? user.ownerId : user._id,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      groupId,
      routeId,
    });

    await this.ormProvider.commit();

    return pointOfSale;
  }
}

export default CreatePointOfSaleService;

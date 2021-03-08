import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  pointOfSaleId: string;
  label: string;
  contactName: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  routeId: string;
  extraInfo: string;
}

@injectable()
class EditPointOfSaleService {
  constructor(
    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    userId,
    contactName,
    label,
    primaryPhoneNumber,
    secondaryPhoneNumber,
    routeId,
    pointOfSaleId,
    extraInfo,
  }: Request): Promise<PointOfSale> {
    const user = await this.usersRepository.findOne({
      filters: { _id: userId },
    });

    if (!user) throw AppError.userNotFound;

    const pointOfSale = await this.pointsOfSaleRepository.findOne({
      filters: {
        _id: pointOfSaleId,
      },
    });

    if (!pointOfSale) throw AppError.pointOfSaleNotFound;

    if (user.role !== Role.OWNER && user.role !== Role.MANAGER)
      throw AppError.authorizationError;

    if (user.role === Role.OWNER) {
      if (pointOfSale.ownerId === user._id) throw AppError.authorizationError;
    }

    if (user.role === Role.MANAGER) {
      if (!user.permissions?.editPointsOfSale)
        throw AppError.authorizationError;

      if (!user.groupIds?.includes(pointOfSale.groupId))
        throw AppError.authorizationError;
    }

    if (label) pointOfSale.label = label;

    pointOfSale.contactName = contactName;

    pointOfSale.primaryPhoneNumber = primaryPhoneNumber;

    pointOfSale.secondaryPhoneNumber = secondaryPhoneNumber;

    pointOfSale.routeId = routeId;

    pointOfSale.address.extraInfo = extraInfo;

    this.pointsOfSaleRepository.save(pointOfSale);

    await this.ormProvider.commit();

    return pointOfSale;
  }
}
export default EditPointOfSaleService;

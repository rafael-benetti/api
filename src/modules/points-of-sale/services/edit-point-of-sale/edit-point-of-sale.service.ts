import LogType from '@modules/logs/contracts/enums/log-type.enum';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
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
  pointOfSaleId: string;
  label?: string;
  contactName?: string;
  primaryPhoneNumber?: string;
  secondaryPhoneNumber?: string;
  rent?: number;
  isPercentage?: boolean;
  address?: Address;
}

@injectable()
class EditPointOfSaleService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('LogsRepository')
    private logsRepository: LogsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    pointOfSaleId,
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

    if (user.role !== Role.OWNER && !user.permissions?.editPointsOfSale)
      throw AppError.authorizationError;

    const pointOfSale = await this.pointsOfSaleRepository.findOne({
      by: 'id',
      value: pointOfSaleId,
    });

    if (!pointOfSale) throw AppError.pointOfSaleNotFound;

    if (user.role === Role.OWNER) {
      if (user.id !== pointOfSale.ownerId) throw AppError.authorizationError;
    } else if (!user.groupIds?.includes(pointOfSale.groupId))
      throw AppError.authorizationError;

    if (label) pointOfSale.label = label;
    if (contactName) pointOfSale.contactName = contactName;
    if (primaryPhoneNumber) pointOfSale.primaryPhoneNumber = primaryPhoneNumber;
    if (secondaryPhoneNumber)
      pointOfSale.secondaryPhoneNumber = secondaryPhoneNumber;
    if (rent !== undefined) pointOfSale.rent = rent;
    if (isPercentage !== undefined) pointOfSale.isPercentage = isPercentage;
    if (address) pointOfSale.address.extraInfo = address.extraInfo;

    this.pointsOfSaleRepository.save(pointOfSale);

    this.logsRepository.create({
      createdBy: user.id,
      groupId: pointOfSale.groupId,
      ownerId: user.ownerId || user.id,
      type: LogType.EDIT_POS,
      posId: pointOfSale.id,
    });

    await this.ormProvider.commit();

    return pointOfSale;
  }
}

export default EditPointOfSaleService;

import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Redis from 'ioredis';
import TypeCompaniesRepository from 'migration-script/modules/companies/typeorm/repositories/type-companies.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import AppError from '@shared/errors/app-error';
import Address from '@modules/points-of-sale/contracts/models/address';
import TypeSellingPointsRepository from '../typeorm/repositories/selling-points.repostory';

@injectable()
class UserScript {
  private client = new Redis();

  constructor(
    @inject('TypeCompaniesRepository')
    private typeCompaniesRepository: TypeCompaniesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('TypeSellingPointsRepository')
    private typeSellingPointsRepository: TypeSellingPointsRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    this.ormProvider.clear();
    const typeSellingPoints = await this.typeSellingPointsRepository.find();

    typeSellingPoints.forEach(async typeSellingPoint => {
      const groupId = (await this.client.get(
        `@groups:${typeSellingPoint.companyId}`,
      )) as string;

      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: groupId,
      });

      if (!group) throw AppError.groupNotFound;

      const ownerId = (await this.client.get(
        `@users:${group.ownerId}`,
      )) as string;

      const address: Address = {
        city: typeSellingPoint.address.city,
        extraInfo: typeSellingPoint.address.note,
        neighborhood: typeSellingPoint.address.neighborhood,
        number: typeSellingPoint.address.number.toString(),
        state: typeSellingPoint.address.state,
        street: typeSellingPoint.address.street,
        zipCode: typeSellingPoint.address.zipCode,
      };

      this.pointsOfSaleRepository.create({
        label: typeSellingPoint.name,
        contactName: typeSellingPoint.responsible,
        primaryPhoneNumber: typeSellingPoint.phone1,
        secondaryPhoneNumber: typeSellingPoint.phone2,
        isPercentage: false,
        rent: 0,
        groupId,
        ownerId,
        address,
      });
    });
    await this.ormProvider.commit();
  }
}

export default UserScript;

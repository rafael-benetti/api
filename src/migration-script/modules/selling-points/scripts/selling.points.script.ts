import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Redis from 'ioredis';
import TypeCompaniesRepository from 'migration-script/modules/companies/typeorm/repositories/type-companies.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
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
      const groupId = this.client.get(
        `@groups:${typeSellingPoint.companyId}`,
      ) as string;

      this.pointsOfSaleRepository.create({
        label: typeSellingPoint.name,
        contactName: typeSellingPoint.responsible,
        primaryPhoneNumber: typeSellingPoint.phone1,
        secondaryPhoneNumber: typeSellingPoint.phone2,
        groupId,
        isPercentage: false,
        rent: 0,
      });
    });
    await this.ormProvider.commit();
  }
}

export default UserScript;

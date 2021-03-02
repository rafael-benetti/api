import createPointOfSaleDto from '@modules/points-of-sale/contracts/dtos/create-point-of-sale-dto';
import findByLableAndGroupIdDto from '@modules/points-of-sale/contracts/dtos/find-by-lable-and-group-id-dto';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';

import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroPointOfSale from '../models/mikro-point-of-sale';

class MikroPointsOfSaleRepository implements PointsOfSaleRepository {
  private ormProvider: MikroOrmProvider;

  constructor() {
    this.ormProvider = container.resolve<MikroOrmProvider>('OrmProvider');
  }

  async findByLabelAndGroupId({
    label,
    groupId,
  }: findByLableAndGroupIdDto): Promise<PointOfSale | undefined> {
    const mikroPointOfSale = await this.ormProvider.entityManager.findOne(
      MikroPointOfSale,
      { label, groupId },
    );

    if (mikroPointOfSale) return MikroMapper.map(mikroPointOfSale);

    return undefined;
  }

  async findByOwnerId(ownerId: string): Promise<PointOfSale[]> {
    const mikroPointsOfSale = await this.ormProvider.entityManager.find(
      MikroPointOfSale,
      {
        ownerId,
      },
    );

    const pointsOfSale = mikroPointsOfSale.map(mikroPointOfSale =>
      MikroMapper.map(mikroPointOfSale),
    );

    return pointsOfSale;
  }

  async findByGroupIds(groupIds: string[]): Promise<PointOfSale[]> {
    const mikroPointsOfSale = await this.ormProvider.entityManager.find(
      MikroPointOfSale,
      { groupId: groupIds },
    );

    const pointsOfSale = mikroPointsOfSale.map(mikroPointOfSale =>
      MikroMapper.map(mikroPointOfSale),
    );

    return pointsOfSale;
  }

  async save(): Promise<void> {
    await this.ormProvider.commit();
  }

  create(data: createPointOfSaleDto): PointOfSale {
    const pointOfSale = new MikroPointOfSale(data);

    this.ormProvider.entityManager.persist(pointOfSale);

    return pointOfSale;
  }
}

export default MikroPointsOfSaleRepository;

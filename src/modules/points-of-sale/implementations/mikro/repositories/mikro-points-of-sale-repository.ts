import createPointOfSaleDto from '@modules/points-of-sale/contracts/dtos/create-point-of-sale-dto';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';

import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import { container } from 'tsyringe';
import MikroPointOfSale from '../models/mikro-point-of-sale';

class MikroPointsOfSaleRepository implements PointsOfSaleRepository {
  private entityManager = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroPointOfSale);

  create(data: createPointOfSaleDto): PointOfSale {
    const pointOfSale = new MikroPointOfSale(data);

    this.entityManager.persist(pointOfSale);

    return pointOfSale;
  }

  async findOne({
    filters,
    populate,
  }: FindEntityDto<PointOfSale>): Promise<PointOfSale | undefined> {
    const pointOfSale = await this.entityManager.findOne(
      { ...filters },
      { populate },
    );

    return pointOfSale ? MikroMapper.map(pointOfSale) : undefined;
  }

  async find({
    filters,
    offset,
    limit,
    populate,
  }: FindEntityDto<PointOfSale>): Promise<PointOfSale[]> {
    const pointsOfsale = await this.entityManager.find(
      { ...filters },
      { populate, limit, offset },
    );

    return pointsOfsale;
  }

  async findByGroupIds(data: string[]): Promise<PointOfSale[]> {
    const pointsOfSale = await this.entityManager.find({
      groupId: data,
    });

    return pointsOfSale;
  }

  async save(data: PointOfSale): Promise<void> {
    const mikroPointOfSale = MikroMapper.map(data);
    this.entityManager.persist(mikroPointOfSale);
  }
}

export default MikroPointsOfSaleRepository;

import createPointOfSaleDto from '@modules/points-of-sale/contracts/dtos/create-point-of-sale-dto';
import FindPointsOfSaleDto from '@modules/points-of-sale/contracts/dtos/find-points-of-sale-dto';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';

import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroPointOfSale from '../models/mikro-point-of-sale';

class MikroPointsOfSaleRepository implements PointsOfSaleRepository {
  private ormProvider = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroPointOfSale);

  create(data: createPointOfSaleDto): PointOfSale {
    const pointOfSale = new MikroPointOfSale(data);

    this.ormProvider.persist(pointOfSale);

    return pointOfSale;
  }

  async findOne({
    filters,
    populate,
  }: FindPointsOfSaleDto): Promise<PointOfSale | undefined> {
    const pointOfSale = await this.ormProvider.findOne(
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
  }: FindPointsOfSaleDto): Promise<PointOfSale[]> {
    const pointsOfsale = await this.ormProvider.find(
      { ...filters },
      { populate, limit, offset },
    );

    return pointsOfsale;
  }

  async save(data: PointOfSale): Promise<void> {
    this.ormProvider.persist(data);
  }
}

export default MikroPointsOfSaleRepository;

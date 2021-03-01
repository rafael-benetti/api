import createPointOfSaleDto from '@modules/points-of-sale/contracts/dtos/create-point-of-sale-dto';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale-repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { inject } from 'tsyringe';
import MikroPointOfSale from '../models/mikro-point-of-sale';

class MikroPointsOfSaleRepository implements PointsOfSaleRepository {
  constructor(
    @inject('OrmProvider')
    private ormProvider: MikroOrmProvider,
  ) {}

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

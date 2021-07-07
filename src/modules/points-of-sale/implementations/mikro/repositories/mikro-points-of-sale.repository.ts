import logger from '@config/logger';
import CreatePointOfSaleDto from '@modules/points-of-sale/contracts/dtos/create-point-of-sale.dto';
import FindPointOfSaleDto from '@modules/points-of-sale/contracts/dtos/find-point-of-sale.dto';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroPointOfSale from '../models/mikro-point-of-sale';
import PointOfSaleMapper from '../models/point-of-sale-mapper';

class MikroPointsOfSaleRepository implements PointsOfSaleRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroPointOfSale);

  create(data: CreatePointOfSaleDto): PointOfSale {
    const pointOfSale = new MikroPointOfSale(data);
    this.repository.persist(pointOfSale);
    return PointOfSaleMapper.toApi(pointOfSale);
  }

  async findOne(data: FindPointOfSaleDto): Promise<PointOfSale | undefined> {
    const pointOfSale = await this.repository.findOne(
      {
        ...(data.by && { [data.by]: data.value }),
      },
      data.populate,
    );

    return pointOfSale ? PointOfSaleMapper.toApi(pointOfSale) : undefined;
  }

  async find(
    data: FindPointOfSaleDto,
  ): Promise<{ count: number; pointsOfSale: PointOfSale[] }> {
    logger.info(data);
    const [pointsOfSale, count] = await this.repository.findAndCount(
      {
        ...(data.by && { [data.by]: data.value }),
        ...(data.filters?.groupId && { groupId: data.filters.groupId }),
        ...(data.filters?.ownerId && { ownerId: data.filters.ownerId }),
        ...(data.filters?.label && {
          label: new RegExp(data.filters.label, 'i'),
        }),
      },
      {
        offset: data.filters?.offset,
        limit: data.filters?.limit,
        ...(data.fields && { fields: data.fields }),
        ...(data.populate && { populate: data.populate }),
      },
    );

    return {
      count,
      pointsOfSale: pointsOfSale.map(pointOfSale =>
        PointOfSaleMapper.toApi(pointOfSale),
      ),
    };
  }

  save(data: PointOfSale): void {
    const pointOfSale = PointOfSaleMapper.toOrm(data);
    this.repository.persist(pointOfSale);
  }

  delete(data: PointOfSale): void {
    const pointOfSale = PointOfSaleMapper.toOrm(data);
    this.repository.remove(pointOfSale);
  }
}

export default MikroPointsOfSaleRepository;

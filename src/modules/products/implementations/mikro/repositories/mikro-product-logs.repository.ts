import CreateProductLogDto from '@modules/products/contracts/dtos/create-product-log.dto';
import FindProductLogsDto from '@modules/products/contracts/dtos/find-product-logs.dto';

import ProductLog from '@modules/products/contracts/entities/product-log';
import ProductLogsRepository from '@modules/products/contracts/repositories/product-logs.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroProductLog from '../entities/mikro-product-log';
import ProductLogMapper from '../mappers/product-log-mapper';

export default class MikroProductLogsRepository
  implements ProductLogsRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroProductLog);

  create(data: CreateProductLogDto): ProductLog {
    const productLog = new MikroProductLog(data);
    this.repository.persist(productLog);
    return ProductLogMapper.map(productLog);
  }

  async find(data: FindProductLogsDto): Promise<ProductLog[]> {
    const { groupId, startDate, endDate } = data.filters;
    const query: Record<string, unknown> = {};

    if (groupId) query.groupId = groupId;
    if (startDate && endDate)
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    if (startDate)
      query.date = {
        $gte: startDate,
      };
    if (endDate)
      query.date = {
        $lte: endDate,
      };

    const productLogs = await this.repository.find(
      { ...query },
      {
        limit: data.limit,
        offset: data.offset,
      },
    );

    return productLogs.map(productLog => ProductLogMapper.map(productLog));
  }
}

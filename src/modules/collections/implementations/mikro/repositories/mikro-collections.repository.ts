import createCollectionDto from '@modules/collections/contracts/dtos/create-collection.dto';
import FindCollectionsDto from '@modules/collections/contracts/dtos/find-collections.dto';

import Collection from '@modules/collections/contracts/entities/collection';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroCollection from '../entities/mikro-collection';
import CollectionsMapper from '../mappers/collections.mapper';

export default class MikroCollectionsRepository
  implements CollectionsRepository
{
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroCollection);

  create(data: createCollectionDto): Collection {
    const collection = new MikroCollection(data);
    return CollectionsMapper.map(collection);
  }

  async findOne(collectionId: string): Promise<Collection | undefined> {
    const collection = await this.repository.findOne(
      {
        id: collectionId,
      },
      {
        populate: [
          'previousCollection',
          'previousCollection.user',
          'user',
          'group',
          'pointOfSale',
          'route',
          'machine',
        ],
      },
    );

    return collection ? CollectionsMapper.map(collection) : undefined;
  }

  async findLastCollection(machineId: string): Promise<Collection | undefined> {
    const collection = await this.repository.findOne(
      {
        machineId,
      },
      {
        orderBy: {
          date: 'DESC',
        },
      },
    );
    return collection ? CollectionsMapper.map(collection) : undefined;
  }

  async find(
    data: FindCollectionsDto,
  ): Promise<{ collections: Collection[]; count: number }> {
    const query: Record<string, unknown> = {};

    const [collections, count] = await this.repository.findAndCount(
      {
        ...(data.groupIds && {
          groupId: {
            $in: data.groupIds,
          },
        }),
        ...(data.startDate && { date: { $gte: data.startDate } }),
        ...query,
        ...(data.machineId && { machineId: data.machineId }),
        ...(data.routeId && { routeId: data.routeId }),
        ...(data.userId && { userId: data.userId }),
        ...(data.pointOfSaleId && { pointOfSaleId: data.pointOfSaleId }),
      },
      {
        limit: data.limit,
        orderBy: {
          date: 'DESC',
        },
        offset: data.offset,
        populate: [
          'previousCollection',
          'previousCollection.user',
          'user',
          'group',
          'pointOfSale',
          'route',
          'machine',
        ],
      },
    );

    return {
      collections: collections.map(collection =>
        CollectionsMapper.map(collection),
      ),
      count,
    };
  }

  save(data: Collection): void {
    const collection = CollectionsMapper.map(data);
    this.repository.persist(collection);
  }
}

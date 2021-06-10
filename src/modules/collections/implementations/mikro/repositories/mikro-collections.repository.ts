import logger from '@config/logger';
import createCollectionDto from '@modules/collections/contracts/dtos/create-collection.dto';
import FindCollectionsDto from '@modules/collections/contracts/dtos/find-collections.dto';

import Collection from '@modules/collections/contracts/entities/collection';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroCollection from '../entities/mikro-collection';
import CollectionsMapper from '../mappers/collections.mapper';

export default class MikroCollectionsRepository
  implements CollectionsRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroCollection);

  create(data: createCollectionDto): Collection {
    const collection = new MikroCollection(data);
    return CollectionsMapper.map(collection);
  }

  async findOne(collectionId: string): Promise<Collection | undefined> {
    logger.info(collectionId);
    const collection = await this.repository.findOne(
      {
        id: collectionId,
      },
      {
        populate: [
          'previousCollection',
          'user',
          'group',
          'pointOfSale',
          'route',
          'machine',
          'previousCollection.user',
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
    const [collections, count] = await this.repository.findAndCount(
      {
        ...(data.groupIds && {
          groupId: {
            $in: data.groupIds,
          },
        }),
        ...(data.machineId && { machineId: data.machineId }),
        ...(data.startDate && {
          date: {
            $gte: data.startDate,
          },
        }),
        ...(data.endDate && {
          date: {
            $lte: data.endDate,
          },
        }),
      },
      {
        limit: data.limit,
        orderBy: {
          date: 'DESC',
        },
        offset: data.offset,
        populate: [
          'previousCollection',
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

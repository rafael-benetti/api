import CreateCollectionDto from '../dtos/create-collection.dto';
import FindCollectionsDto from '../dtos/find-collections.dto';
import Collection from '../entities/collection';

export default interface CollectionsRepository {
  create(data: CreateCollectionDto): Collection;
  findLastCollection(machineId: string): Promise<Collection | undefined>;
  find(
    data: FindCollectionsDto,
  ): Promise<{
    collections: Collection[];
    count: number;
  }>;
  save(data: Collection): void;
}

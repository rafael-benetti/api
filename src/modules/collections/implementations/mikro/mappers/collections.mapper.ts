import Collection from '@modules/collections/contracts/entities/collection';
import MikroCollection from '../entities/mikro-collection';

export default abstract class CollectionsMapper {
  static map(data: MikroCollection): Collection;

  static map(data: Collection): MikroCollection;

  static map(data: unknown): unknown {
    const collection =
      data instanceof MikroCollection
        ? new Collection()
        : new MikroCollection();

    Object.assign(collection, data);

    return collection;
  }
}

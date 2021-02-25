import Owner from '@modules/owners/contracts/models/Owner';
import TypeormOwner from '@modules/owners/implementations/typeorm/models/TypeormOwner';
import {
  EntityManager,
  getConnection,
  Transaction,
  TransactionManager,
} from 'typeorm';

import OrmProvider from '../contracts/models/IOrmProvider';

class TypeormProvider implements OrmProvider {
  static map(entity: Owner): TypeormOwner;

  static map(entity: unknown): unknown {
    if (entity instanceof Owner) {
      const owner = new TypeormOwner();
      Object.assign(owner, entity);
      return owner;
    }

    if (entity instanceof TypeormOwner) {
      const typeormOwner = new Owner();
      Object.assign(typeormOwner, entity);
      return typeormOwner;
    }
  }

  async save(entities: Array<never>): Promise<unknown[]> {
    const savedEndities = await this.runTransaction(
      entities
        .map(entity => TypeormProvider.map(entity))
        .filter(entity => entity !== undefined),
      getConnection().createEntityManager(),
    );

    return savedEndities;
  }

  @Transaction()
  private async runTransaction(
    entities: unknown[],
    @TransactionManager()
    manager: EntityManager,
  ): Promise<unknown[]> {
    const savedEntities = await manager.save(entities);
    return savedEntities;
  }
}

export default TypeormProvider;

import logger from '@config/logger';
import mongoConfig from '@config/mongo';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MongoDriver, MongoEntityManager } from '@mikro-orm/mongodb';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import MikroPointOfSale from '@modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale';
import MikroUser from '@modules/users/implementations/mikro/models/mikro-user';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import { RequestHandler } from 'express';

class MikroOrmProvider implements OrmProvider {
  entityManager: MongoEntityManager;

  async connect(): Promise<void> {
    const orm = await MikroORM.init<MongoDriver>({
      type: 'mongo',
      clientUrl: mongoConfig.url,
      entities: [MikroUser, MikroGroup, MikroPointOfSale],
      implicitTransactions: true,
      debug: true,
    });

    this.entityManager = orm.em;

    logger.info('🔌 - App connected to the database');
  }

  async commit(): Promise<void> {
    await this.entityManager.flush();
  }

  forkMiddleware: RequestHandler = (req, res, next) => {
    RequestContext.create(this.entityManager, next);
  };
}

export default MikroOrmProvider;

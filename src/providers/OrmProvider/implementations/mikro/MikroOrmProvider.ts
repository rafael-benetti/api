import logger from '@config/logger';
import mongoConfig from '@config/mongo';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MongoDriver, MongoEntityManager } from '@mikro-orm/mongodb';
import MikroUser from '@modules/users/implementations/mikro/models/MikroUser';
import { RequestHandler } from 'express';
import IOrmProvider from 'providers/OrmProvider/contracts/models/OrmProvider';

class MikroOrmProvider implements IOrmProvider {
  entityManager: MongoEntityManager;

  async connect(): Promise<void> {
    const orm = await MikroORM.init<MongoDriver>({
      type: 'mongo',
      clientUrl: mongoConfig.url,
      entities: [MikroUser],
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

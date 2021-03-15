import logger from '@config/logger';
import mongoConfig from '@config/mongo';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MongoDriver, MongoEntityManager } from '@mikro-orm/mongodb';
import MikroAdmin from '@modules/admins/implementations/mikro/models/mikro-admin';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import MikroPointOfSale from '@modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale';
import MikroPointsOfSaleRepository from '@modules/points-of-sale/implementations/mikro/repositories/mikro-points-of-sale.repository';
import MikroUser from '@modules/users/implementations/mikro/models/mikro-user';

import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import { RequestHandler } from 'express';

class MikroOrmProvider implements OrmProvider {
  entityManager: MongoEntityManager;

  async connect(): Promise<void> {
    const orm = await MikroORM.init<MongoDriver>({
      type: 'mongo',
      forceUndefined: true,
      clientUrl: mongoConfig.url,
      entities: [MikroAdmin, MikroUser, MikroGroup, MikroPointOfSale],
      implicitTransactions: true,
      debug: true,
      ensureIndexes: true,
    });

    this.entityManager = orm.em;
    this.entityManager.getDriver().createCollections();

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

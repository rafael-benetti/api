import logger from '@config/logger';
import mongoConfig from '@config/mongo';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MongoDriver, MongoEntityManager } from '@mikro-orm/mongodb';
import MikroAdmin from '@modules/admins/implementations/mikro/models/mikro-admin';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import MikroMachineCategory from '@modules/machine-categories/implementations/mikro/models/mikro-machine-category';
import MikroMachine from '@modules/machines/implementations/mikro/models/mikro-machine';
import MikroPointOfSale from '@modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale';
import MikroRoute from '@modules/routes/implementations/models/mikro-route';
import MikroUser from '@modules/users/implementations/mikro/models/mikro-user';

import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import { RequestHandler } from 'express';

class MikroOrmProvider implements OrmProvider {
  entityManager: MongoEntityManager;

  async connect(): Promise<void> {
    const orm = await MikroORM.init<MongoDriver>({
      type: 'mongo',
      clientUrl: mongoConfig.url,
      entities: [
        MikroUser,
        MikroGroup,
        MikroPointOfSale,
        MikroAdmin,
        MikroMachine,
        MikroMachineCategory,
        MikroRoute,
      ],
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

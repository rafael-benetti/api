import logger from '@config/logger';
import mongoConfig from '@config/mongo';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MongoDriver, MongoEntityManager } from '@mikro-orm/mongodb';
import MikroAdmin from '@modules/admins/implementations/mikro/models/mikro-admin';
import MikroCategory from '@modules/categories/implementations/mikro/model/mikro-category';
import MikroCollection from '@modules/collections/implementations/mikro/entities/mikro-collection';
import MikroCounterType from '@modules/counter-types/implementations/mikro/models/mikro-counter-type';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import MikroMachine from '@modules/machines/implementations/mikro/models/mikro-machine';
import MikroPointOfSale from '@modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale';
import MikroRoute from '@modules/routes/implementations/mikro/models/mikro-route';
import MikroTelemetryLog from '@modules/telemetry-logs/implementations/mikro/entities/mikro-telemetry-log';
import MikroTelemetryBoard from '@modules/telemetry/implementations/mikro/entities/mikro-telemetry-board';
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
      entities: [
        MikroAdmin,
        MikroUser,
        MikroGroup,
        MikroMachine,
        MikroPointOfSale,
        MikroCategory,
        MikroRoute,
        MikroCounterType,
        MikroTelemetryBoard,
        MikroCollection,
        MikroTelemetryLog,
      ],
      implicitTransactions: true,
      debug: true,
      // ensureIndexes: true,
    });

    this.entityManager = orm.em;
    this.entityManager.getDriver().createCollections();

    logger.info('🔌 - App connected to the database');
  }

  async commit(): Promise<void> {
    await this.entityManager.flush();
  }

  async clear(): Promise<void> {
    this.entityManager.clear();
  }

  forkMiddleware: RequestHandler = (req, res, next) => {
    RequestContext.create(this.entityManager, next);
  };
}

export default MikroOrmProvider;

import logger from '@config/logger';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import { RequestHandler } from 'express';

class FakeOrmProvider implements OrmProvider {
  async connect(): Promise<void> {
    logger.info('🔌 - App connected to the database');
  }

  async commit(): Promise<void> {
    return undefined;
  }

  forkMiddleware: RequestHandler = (req, res, next) => {
    return next;
  };
}

export default FakeOrmProvider;

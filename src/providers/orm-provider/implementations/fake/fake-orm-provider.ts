import logger from '@config/logger';
import { RequestHandler } from 'express';
import OrmProvider from '../../contracts/models/OrmProvider';

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

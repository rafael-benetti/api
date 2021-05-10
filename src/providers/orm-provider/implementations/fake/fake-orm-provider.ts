import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import { RequestHandler } from 'express';

class FakeOrmProvider implements OrmProvider {
  connect(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async commit(): Promise<void> {
    return undefined;
  }

  forkMiddleware: RequestHandler = (req, res, next) => {
    return next;
  };
}

export default FakeOrmProvider;

import { RequestHandler } from 'express';

interface OrmProvider {
  connect(): Promise<void>;
  commit(): Promise<void>;
  forkMiddleware: RequestHandler;
}

export default OrmProvider;

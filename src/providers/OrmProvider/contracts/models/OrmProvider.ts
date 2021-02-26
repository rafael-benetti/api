import { RequestHandler } from 'express';

interface IOrmProvider {
  connect(): Promise<void>;
  commit(): Promise<void>;
  forkMiddleware: RequestHandler;
}

export default IOrmProvider;

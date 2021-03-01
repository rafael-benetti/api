import { container } from 'tsyringe';
import SessionProvider from './contracts/models/session.provider';
import RedisSessionProvider from './implementations/redis/redis-session.provider';

container.registerSingleton<SessionProvider>(
  'SessionProvider',
  RedisSessionProvider,
);

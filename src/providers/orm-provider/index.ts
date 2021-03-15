import { container } from 'tsyringe';
import OrmProvider from './contracts/models/orm-provider';
import MikroOrmProvider from './implementations/mikro/mikro-orm-provider';

container.registerSingleton<OrmProvider>('OrmProvider', MikroOrmProvider);

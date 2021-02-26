import { container } from 'tsyringe';
import OrmProvider from './contracts/models/OrmProvider';
import MikroOrmProvider from './implementations/mikro/MikroOrmProvider';

container.registerSingleton<OrmProvider>('OrmProvider', MikroOrmProvider);

import { container } from 'tsyringe';
import IHashProvider from './contracts/models/IHashProvider';
import BcryptHashProvider from './implementations/bcrypt/BcryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);

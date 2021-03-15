import { container } from 'tsyringe';
import HashProvider from './contracts/models/hash-provider';
import BcryptHashProvider from './implementations/bcrypt/brcypt-hash-provider';

container.registerSingleton<HashProvider>('HashProvider', BcryptHashProvider);

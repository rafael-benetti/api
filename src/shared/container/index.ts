import { container } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import ITransferProductsRepository from '@modules/products/repositories/ITransferProductsRepository';
import TransferProductsRepository from '@modules/products/infra/typeorm/repositories/TransferProductsRepository';

import IMachinesRepository from '@modules/machines/repositories/IMachinesRepository';
import MachinesRepository from '@modules/machines/infra/typeorm/repositories/MachinesRepository';

import IMachineCategoriesRepository from '@modules/machines/repositories/IMachineCategoriesRepository';
import MachineCategoriesRepository from '@modules/machines/infra/typeorm/repositories/MachineCategoriesRepository';

container.registerSingleton<IMachineCategoriesRepository>(
  'MachineCategoriesRepository',
  MachineCategoriesRepository,
);

container.registerSingleton<IMachinesRepository>(
  'MachinesRepository',
  MachinesRepository,
);

container.registerSingleton<ITransferProductsRepository>(
  'TransferProductsRepository',
  TransferProductsRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ICompaniesRepository>(
  'CompaniesRepository',
  CompaniesRepository,
);

import { container } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';

import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import ProductStocksRepository from '@modules/products/infra/typeorm/repositories/ProductStocksRepository';

import IMachinesRepository from '@modules/machines/repositories/IMachinesRepository';
import MachinesRepository from '@modules/machines/infra/typeorm/repositories/MachinesRepository';

import IMachineCategoriesRepository from '@modules/machines/repositories/IMachineCategoriesRepository';
import MachineCategoriesRepository from '@modules/machines/infra/typeorm/repositories/MachineCategoriesRepository';

import ICountersRepository from '@modules/counters/repositories/ICoutersRepository';
import CountersRepository from '@modules/counters/infra/typeorm/repositories/CountersRepository';

import ICounterGroupsRepository from '@modules/counters/repositories/ICounterGroupsRepository';
import CounterGroupsRepository from '@modules/counters/infra/typeorm/repositories/CounterGroupsRepository';

import ISellingPointsRepository from '@modules/sellingPoints/repositories/ISellingPointsRepository';
import SellingPointsRepository from '@modules/sellingPoints/infra/typeorm/repositories/SellingPointsRepository';

import IAddressesRepository from '@modules/sellingPoints/repositories/IAddressesRepository';
import AddressesRepository from '@modules/sellingPoints/infra/typeorm/repositories/AddressesRepository';

import IMachineCollectionRepository from '@modules/machine_collection/repositories/IMachineCollectionRepository';
import MachineCollectionRepository from '@modules/machine_collection/infra/typeorm/repositories/MachineCollectionRepository';

import MachineCollectCountersRepository from '@modules/machine_collection/infra/typeorm/repositories/MachineCollectCounterRepository';
import IMachineCollectionCounterRepository from '@modules/machine_collection/repositories/IMachineCollectCounterRepository';

import MachineCollectCounterPhotosRepository from '@modules/machine_collection/infra/typeorm/repositories/MachineCollectCounterPhotosRepository';
import IMachineCollectCounterPhotosRepository from '@modules/machine_collection/repositories/IMachineCollectCounterPhotosRepository';
import IProductStocksRepository from '@modules/products/repositories/IProductStocksRepository';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';

container.registerSingleton<IMachineCollectCounterPhotosRepository>(
  'MachineCollectCounterPhotosRepository',
  MachineCollectCounterPhotosRepository,
);
container.registerSingleton<IMachineCollectionCounterRepository>(
  'MachineCollectionCounterRepository',
  MachineCollectCountersRepository,
);

container.registerSingleton<IMachineCollectionRepository>(
  'MachineCollectionRepository',
  MachineCollectionRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

container.registerSingleton<ISellingPointsRepository>(
  'SellingPointsRepository',
  SellingPointsRepository,
);

container.registerSingleton<ICounterGroupsRepository>(
  'CounterGroupsRepository',
  CounterGroupsRepository,
);

container.registerSingleton<ICountersRepository>(
  'CountersRepository',
  CountersRepository,
);

container.registerSingleton<IMachineCategoriesRepository>(
  'MachineCategoriesRepository',
  MachineCategoriesRepository,
);

container.registerSingleton<IMachinesRepository>(
  'MachinesRepository',
  MachinesRepository,
);

container.registerSingleton<IProductStocksRepository>(
  'ProductStocksRepository',
  ProductStocksRepository,
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

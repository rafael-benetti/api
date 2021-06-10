import { container, delay } from 'tsyringe';
import TypeCompaniesRepository from './companies/typeorm/repositories/type-companies.repository';
import TypeCountersRepository from './counters/typeorm/repositories/type-counters.repository';
import TypeCreditsRepository from './credits/typeorm/repositories/type-credits.repository';
import TypeGiftsRepository from './gifts/typeorm/repositories/type-gifts.respository';
import TypeMachineCollectRepository from './machine-collect/typeorm/repositories/type-machine-collect-repository';
import MachineCategoriesRepository from './machines-categories/typeorm/repositories/type-machine-categories.repository';
import TypeMachinesRepository from './machines/typeorm/repositories/type-machines.repository';
import TypeSellingPointsRepository from './selling-points/typeorm/repositories/selling-points.repostory';
import TypeTelemetriesRepository from './telemetries/typeorm/repositories/type-telemetries.repository';
import TypeUsersRepository from './users/typeorm/repostories/type-users-repository';

container.registerSingleton<TypeUsersRepository>(
  'TypeUsersRepository',
  delay(() => TypeUsersRepository),
);

container.registerSingleton<TypeCompaniesRepository>(
  'TypeCompaniesRepository',
  delay(() => TypeCompaniesRepository),
);

container.registerSingleton<TypeMachinesRepository>(
  'TypeMachinesRepository',
  delay(() => TypeMachinesRepository),
);

container.registerSingleton<TypeCountersRepository>(
  'TypeCountersRepository',
  delay(() => TypeCountersRepository),
);

container.registerSingleton<TypeSellingPointsRepository>(
  'TypeSellingPointsRepository',
  delay(() => TypeSellingPointsRepository),
);

container.registerSingleton<TypeTelemetriesRepository>(
  'TypeTelemetriesRepository',
  delay(() => TypeTelemetriesRepository),
);

container.registerSingleton<TypeCreditsRepository>(
  'TypeCreditsRepository',
  delay(() => TypeCreditsRepository),
);

container.registerSingleton<TypeGiftsRepository>(
  'TypeGiftsRepository',
  delay(() => TypeGiftsRepository),
);

container.registerSingleton<MachineCategoriesRepository>(
  'MachineCategoriesRepository',
  delay(() => MachineCategoriesRepository),
);

container.registerSingleton<TypeMachineCollectRepository>(
  'TypeMachineCollectRepository',
  delay(() => TypeMachineCollectRepository),
);

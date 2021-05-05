import { container, delay } from 'tsyringe';
import TypeCompaniesRepository from './companies/typeorm/repositories/type-companies.repository';
import TypeCountersRepository from './counters/typeorm/repositories/type-counters.repository';
import TypeMachinesRepository from './machines/typeorm/repositories/type-machines.repository';
import TypeSellingPointsRepository from './selling-points/typeorm/repositories/selling-points.repostory';
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

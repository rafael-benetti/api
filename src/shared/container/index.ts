import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import MikroAdminsRepository from '@modules/admins/implementations/mikro/repositories/mikro-admins.repository';
import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import MikroCategoriesRepository from '@modules/categories/implementations/mikro/repositories/mikro-categories.repositories';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import MikroCollectionsRepository from '@modules/collections/implementations/mikro/repositories/mikro-collections.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import MikroCounterTypesRepository from '@modules/counter-types/implementations/mikro/repositories/mikro-counter-types.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MikroGroupsRepository from '@modules/groups/implementations/mikro/repositories/mikro-groups.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import MikroMachinesRepository from '@modules/machines/implementations/mikro/repositories/mikro-machines.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import MikroPointsOfSaleRepository from '@modules/points-of-sale/implementations/mikro/repositories/mikro-points-of-sale.repository';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import MikroRoutesRepository from '@modules/routes/implementations/mikro/repositories/mikro-routes.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import MikroTelemetryLogsRepository from '@modules/telemetry-logs/implementations/mikro/repositories/mikro-telemetry-logs.repository';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import MikroTelemetryBoardsRepository from '@modules/telemetry/implementations/mikro/repositories/mikro-telemetry-boards.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import MikroUsersRepository from '@modules/users/implementations/mikro/repositories/mikro-users.repository';
import { container } from 'tsyringe';
import '../../providers';

container.registerSingleton<AdminsRepository>(
  'AdminsRepository',
  MikroAdminsRepository,
);

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  MikroUsersRepository,
);

container.registerSingleton<GroupsRepository>(
  'GroupsRepository',
  MikroGroupsRepository,
);

container.registerSingleton<PointsOfSaleRepository>(
  'PointsOfSaleRepository',
  MikroPointsOfSaleRepository,
);

container.registerSingleton<CategoriesRepository>(
  'CategoriesRepository',
  MikroCategoriesRepository,
);

container.registerSingleton<MachinesRepository>(
  'MachinesRepository',
  MikroMachinesRepository,
);

container.registerSingleton<RoutesRepository>(
  'RoutesRepository',
  MikroRoutesRepository,
);

container.registerSingleton<CounterTypesRepository>(
  'CounterTypesRepository',
  MikroCounterTypesRepository,
);

container.registerSingleton<TelemetryBoardsRepository>(
  'TelemetryBoardsRepository',
  MikroTelemetryBoardsRepository,
);

container.registerSingleton<CollectionsRepository>(
  'CollectionsRepository',
  MikroCollectionsRepository,
);

container.registerSingleton<TelemetryLogsRepository>(
  'TelemetryLogsRepository',
  MikroTelemetryLogsRepository,
);

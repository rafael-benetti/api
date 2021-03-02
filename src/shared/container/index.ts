import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import MikroAdminsRepository from '@modules/admins/implementations/mikro/repositories/mikro-admins.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import MikroGroupsRepository from '@modules/groups/implementations/mikro/repositories/groups-repository';
import MachineCategoriesRepository from '@modules/machine-categories/contracts/repositories/machine-categories-repository';
import MikroMachineCategoriesRepository from '@modules/machine-categories/implementations/mikro/repositories/mikro-machine-categories.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import MikroMachinesRepository from '@modules/machines/implementations/mikro/repositories/mikro-machines.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale-repository';
import MikroPointsOfSaleRepository from '@modules/points-of-sale/implementations/mikro/repositories/mikro-points-of-sale-repository';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import MikroUsersRepository from '@modules/users/implementations/mikro/repositories/mikro-users-repository';
import { container } from 'tsyringe';
import '../../providers';

container.registerSingleton<MachineCategoriesRepository>(
  'MachineCategoriesRepository',
  MikroMachineCategoriesRepository,
);

container.registerSingleton<MachinesRepository>(
  'MachinesRepository',
  MikroMachinesRepository,
);

container.registerSingleton<GroupsRepository>(
  'GroupsRepository',
  MikroGroupsRepository,
);

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  MikroUsersRepository,
);

container.registerSingleton<PointsOfSaleRepository>(
  'PointsOfSaleRepository',
  MikroPointsOfSaleRepository,
);

container.registerSingleton<AdminsRepository>(
  'AdminsRepository',
  MikroAdminsRepository,
);

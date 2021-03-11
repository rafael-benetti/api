import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import MikroAdminsRepository from '@modules/admins/implementations/mikro/repositories/mikro-admins.repository';
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

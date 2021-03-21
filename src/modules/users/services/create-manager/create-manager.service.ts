import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import Permissions from '@modules/users/contracts/models/permissions';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import validatePermissions from '@modules/users/utils/validate-permissions';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  email: string;
  name: string;
  groupIds: string[];
  permissions: Permissions;
  phoneNumber?: string;
}

@injectable()
class CreateManagerService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    email,
    name,
    groupIds,
    permissions,
    phoneNumber,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    let groupUniverse: string[];

    if (user.role === Role.OWNER) {
      groupUniverse = await this.groupsRepository
        .find({
          filters: {
            ownerId: user.id,
          },
        })
        .then(groups => groups.map(group => group.id));
    } else {
      groupUniverse = user.groupIds || [];
    }

    if (
      (user.role !== Role.OWNER && !user.permissions?.createManagers) ||
      groupIds.some(group => !groupUniverse.includes(group))
    )
      throw AppError.authorizationError;

    if (
      !validatePermissions({
        for: 'MANAGER',
        permissions,
      })
    )
      throw AppError.incorrectPermissionsForManager;

    const emailExists = await this.usersRepository.findOne({
      by: 'email',
      value: email,
    });

    if (emailExists) throw AppError.emailAlreadyUsed;

    const manager = this.usersRepository.create({
      email,
      password: this.hashProvider.hash('q1'),
      name,
      role: Role.MANAGER,
      groupIds,
      permissions,
      stock: {
        prizes: [],
        supplies: [],
      },
      phoneNumber,
      isActive: true,
      ownerId: user.ownerId || user.id,
    });

    await this.ormProvider.commit();

    return manager;
  }
}

export default CreateManagerService;

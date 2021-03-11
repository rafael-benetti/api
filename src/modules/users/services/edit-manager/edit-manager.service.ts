import Role from '@modules/users/contracts/enums/role';
import Permissions from '@modules/users/contracts/models/permissions';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import validatePermissions from '@modules/users/utils/validate-permissions';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  managerId: string;
  groupIds?: string[];
  permissions?: Permissions;
  phoneNumber?: string;
  isActive?: boolean;
}

@injectable()
class EditManagerService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    managerId,
    groupIds,
    permissions,
    phoneNumber,
    isActive,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.editManagers)
      throw AppError.authorizationError;

    const manager = await this.usersRepository.findOne({
      by: 'id',
      value: managerId,
    });

    if (!manager) throw AppError.userNotFound;

    if (manager.role !== Role.MANAGER) throw AppError.userNotFound;

    if (manager.groupIds?.every(groupId => !user.groupIds?.includes(groupId)))
      throw AppError.authorizationError;

    if (groupIds) {
      const groupIdsDiff = groupIds
        .filter(x => !manager.groupIds?.includes(x))
        .concat(manager.groupIds?.filter(x => !groupIds.includes(x)) || []);

      if (groupIdsDiff.some(groupId => !user.groupIds?.includes(groupId)))
        throw AppError.authorizationError;

      manager.groupIds = groupIds;
    }

    if (permissions) {
      if (
        !validatePermissions({
          for: 'MANAGER',
          permissions,
        })
      )
        throw AppError.incorrectPermissionsForManager;

      manager.permissions = permissions;
    }

    if (phoneNumber) manager.phoneNumber = phoneNumber;
    if (isActive !== undefined) manager.isActive = isActive;

    this.usersRepository.save(manager);

    await this.ormProvider.commit();

    return manager;
  }
}

export default EditManagerService;

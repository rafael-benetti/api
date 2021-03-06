import LogType from '@modules/logs/contracts/enums/log-type.enum';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import Role from '@modules/users/contracts/enums/role';
import Permissions from '@modules/users/contracts/models/permissions';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import validatePermissions from '@modules/users/utils/validate-permissions';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
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

    @inject('LogsRepository')
    private logsRepository: LogsRepository,

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

    if (user.role !== Role.OWNER && !user.permissions?.createManagers)
      throw AppError.authorizationError;

    const manager = await this.usersRepository.findOne({
      by: 'id',
      value: managerId,
    });

    if (!manager) throw AppError.userNotFound;

    if (manager.role !== Role.MANAGER) throw AppError.userNotFound;

    if (user.role === Role.OWNER && manager.ownerId !== user.id)
      throw AppError.authorizationError;

    if (groupIds) {
      const universe = await getGroupUniverse(user);
      if (
        !isInGroupUniverse({
          groups: groupIds,
          universe,
          method: 'INTERSECTION',
        })
      )
        throw AppError.authorizationError;

      if (user.role !== Role.OWNER) {
        if (manager.groupIds?.every(groupId => !universe.includes(groupId)))
          throw AppError.authorizationError;
      }

      const uncommonGroups = manager.groupIds?.filter(
        group =>
          !manager.groupIds
            ?.filter(group => universe.includes(group))
            ?.includes(group),
      );

      manager.groupIds = [...groupIds, ...(uncommonGroups || [])];
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

    this.logsRepository.create({
      createdBy: user.id,
      groupId: undefined,
      ownerId: user.ownerId || user.id,
      type: LogType.EDIT_MANAGER,
      userId: manager.id,
    });

    await this.ormProvider.commit();

    return manager;
  }
}

export default EditManagerService;

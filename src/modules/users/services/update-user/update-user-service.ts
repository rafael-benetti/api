import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import Role from '@modules/users/contracts/enums/role';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Permissions, {
  managerPermissionKeys,
  operatorPermissionKeys,
} from '../../contracts/models/permissions';

interface Request {
  userId: string;
  targetUserId: string;
  permissions?: Permissions;
  groupIds?: string[];
  name?: string;
  password?: string;
  phone?: string;
  isActive?: boolean;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  public async execute({
    userId,
    targetUserId,
    groupIds,
    name,
    password,
    phone,
    isActive,
    permissions,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER) {
      if (user.role === Role.MANAGER) {
        if (!user.permissions.editUsers) throw AppError.authorizationError;
      }
    }

    const targetUser = await this.usersRepository.findById(targetUserId);

    if (!targetUser) throw AppError.userNotFound;

    if (name) targetUser.name = name;
    if (password) targetUser.password = this.hashProvider.hash(password);
    if (phone) targetUser.phone = phone;
    if (isActive) targetUser.isActive = isActive;

    if (permissions) {
      if (targetUser.role === Role.OPERATOR) {
        const checkPermissions = Object.keys(permissions).some(key => {
          return !operatorPermissionKeys.includes(key);
        });

        if (checkPermissions) throw AppError.incorrectPermissionsForOperator;

        targetUser.permissions = permissions;
      }

      if (targetUser.role === Role.MANAGER) {
        const checkPermissions = Object.keys(permissions).some(
          key => !managerPermissionKeys.includes(key),
        );

        if (checkPermissions) throw AppError.incorrectPermissionsForOperator;

        targetUser.permissions = permissions;
      }
    }

    if (groupIds) {
      if (user.role === Role.MANAGER) {
        const checkGroupsAvailability = Object.keys(groupIds).some(
          groupId => !user.groupIds?.includes(groupId),
        );
        if (checkGroupsAvailability) throw AppError.authorizationError;

        targetUser.groupIds = groupIds;
      }

      if (user.role === Role.OWNER) {
        const ownerGroups = await this.groupsRepository.findByOwnerId(user._id);

        const ownerGroupIds = ownerGroups.map(group => group._id);

        const checkGroupsAvailability = groupIds.some(
          groupId => !ownerGroupIds.includes(groupId),
        );

        if (checkGroupsAvailability) throw AppError.authorizationError;

        targetUser.groupIds = groupIds;
      }
    }

    await this.usersRepository.save(targetUser);

    return targetUser;
  }
}
export default UpdateUserService;

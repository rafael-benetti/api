import Role from '@modules/users/contracts/enums/role';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Permissions, {
  operatorPermissionKeys,
} from '../../contracts/models/permissions';

interface Request {
  userId: string;
  targetUserId: string;
  permissions?: Permissions;
  groups?: string[];
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
  ) {}

  public async execute({
    userId,
    targetUserId,
    groups,
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

        // TODO: Adicionar condição para edição de MANAGER

        if (checkPermissions) throw AppError.incorrectPermissonsForOperator;
      }
    }

    if (groups) {
      // TODO: Adicionar condições para edição de groups
    }

    await this.usersRepository.save(targetUser);

    return targetUser;
  }
}
export default UpdateUserService;

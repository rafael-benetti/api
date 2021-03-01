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
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: Role;
  photo?: string;
  isActive: boolean;
  permissions: Permissions;
  groupIds?: string[];
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  async execute({
    email,
    isActive,
    name,
    role,
    password,
    userId,
    phone,
    permissions,
    groupIds,
  }: Request): Promise<User> {
    const owner = await this.usersRepository.findById(userId);
    if (!owner) throw AppError.userNotFound;

    if (owner.role !== Role.OWNER)
      if (owner.role === Role.MANAGER) {
        if (!owner.permissions.createUsers) throw AppError.authorizationError;
      } else throw AppError.authorizationError;

    const checkUserExists = await this.usersRepository.findByEmail(email);
    if (checkUserExists) throw AppError.emailAlreadyUsed;

    if (role !== Role.OPERATOR && role !== Role.MANAGER)
      throw AppError.authorizationError;

    if (permissions) {
      if (role === Role.OPERATOR) {
        const checkPermissions = Object.keys(permissions).some(key => {
          return !operatorPermissionKeys.includes(key);
        });

        // TODO: adicionar condição para criação de MANAGER
        // TODO: adicionar condição para criação de OWNER

        if (checkPermissions) throw AppError.incorrectPermissonsForOperator;
      }
    }

    const user = await this.usersRepository.create({
      email,
      isActive,
      name,
      role,
      password: this.hashProvider.hash(password),
      ownerId: owner.role === Role.OWNER ? owner._id : owner.ownerId,
      phone,
      permissions,
      groupIds: role === Role.OPERATOR ? undefined : groupIds,
    });

    return user;
  }
}

export default CreateUserService;

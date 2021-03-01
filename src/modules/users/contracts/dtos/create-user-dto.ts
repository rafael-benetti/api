import Role from '../enums/role';

import Permissions from '../models/permissions';

export default interface CreateUserDto {
  email: string;

  password: string;

  name: string;

  phone?: string;

  role: Role;

  photo?: string;

  ownerId?: string;

  isActive: boolean;

  permissions?: Permissions;

  groupIds?: string[];
}

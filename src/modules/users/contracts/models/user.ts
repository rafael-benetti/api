import Role from '../enums/role';
import Permissions from './permissions';

class User {
  _id: string;

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

export default User;

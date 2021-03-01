import { v4 } from 'uuid';
import CreateUserDto from '../dtos/create-user-dto';
import Role from '../enums/role';
import Permissions from './permissions';
import Photo from './photo';

class User {
  _id: string;

  email: string;

  password: string;

  name: string;

  phone?: string;

  role: Role;

  photo?: Photo;

  ownerId?: string;

  isActive: boolean;

  permissions?: Permissions;

  groupIds?: string[];

  constructor(data?: CreateUserDto) {
    if (data) {
      this._id = v4();
      this.name = data.name;
      this.email = data.email;
      this.phone = data.phone;
      this.password = data.password;
      this.ownerId = data.ownerId;
      this.role = data.role;
      this.isActive = data.isActive;
      this.permissions = data.permissions;
      this.groupIds = data.groupIds;
    }
  }
}

export default User;

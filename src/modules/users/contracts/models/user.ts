import { v4 } from 'uuid';
import CreateUserDto from '../dtos/create-user.dto';
import Role from '../enums/role';
import UserStock from './operator-stock';
import Permissions from './permissions';
import Photo from './photo';

class User {
  id: string;

  email: string;

  password: string;

  name: string;

  role: Role;

  groupIds?: string[];

  permissions?: Permissions;

  stock?: UserStock;

  photo?: Photo;

  phoneNumber?: string;

  isActive?: boolean;

  ownerId?: string;

  constructor(data?: CreateUserDto) {
    if (data) {
      this.id = v4();
      this.email = data.email;
      this.password = data.password;
      this.name = data.name;
      this.role = data.role;
      this.groupIds = data.groupIds;
      this.permissions = data.permissions;
      this.stock = data.stock;
      this.photo = data.photo;
      this.phoneNumber = data.phoneNumber;
      this.isActive = data.isActive;
      this.ownerId = data.ownerId;
    }
  }
}

export default User;

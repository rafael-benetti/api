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

  deviceToken?: string;

  type?: 'INDIVIDUAL' | 'COMPANY';

  stateRegistration?: string | undefined;

  document?: string;

  subscriptionPrice?: string;

  subscriptionExpirationDate?: string;

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
      this.deviceToken = data.deviceToken;
      this.type = data.type;
      this.stateRegistration = data.stateRegistration;
      this.document = data.deviceToken;
      this.subscriptionPrice = data.subscriptionPrice;
      this.subscriptionExpirationDate = data.subscriptionExpirationDate;
    }
  }
}

export default User;

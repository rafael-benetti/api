import Role from '../enums/role';
import UserStock from '../models/operator-stock';
import Permissions from '../models/permissions';
import Photo from '../models/photo';

interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: Role;
  groupIds?: string[];
  permissions?: Permissions;
  stock?: UserStock;
  photo?: Photo;
  phoneNumber?: string;
  ownerId?: string;
  isActive?: boolean;
  deviceToken?: string;
  type?: 'INDIVIDUAL' | 'COMPANY';
  stateRegistration?: string | undefined;
  document?: string;
  subscriptionPrice?: string;
  subscriptionExpirationDate?: string;
}

export default CreateUserDto;

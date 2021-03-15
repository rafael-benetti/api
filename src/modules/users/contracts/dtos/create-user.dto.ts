import Role from '../enums/role';
import OperatorStock from '../models/operator-stock';
import Permissions from '../models/permissions';
import Photo from '../models/photo';

interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: Role;
  groupIds?: string[];
  permissions?: Permissions;
  stock?: OperatorStock;
  photo?: Photo;
  phoneNumber?: string;
  ownerId?: string;
  isActive?: boolean;
}

export default CreateUserDto;

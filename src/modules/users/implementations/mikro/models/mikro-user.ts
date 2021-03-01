import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import CreateUserDto from '@modules/users/contracts/dtos/create-user-dto';
import User from '@modules/users/contracts/models/user';
import Permissions from '@modules/users/contracts/models/permissions';
import Role from '@modules/users/contracts/enums/role';
import { v4 } from 'uuid';

@Entity({ tableName: 'users' })
class MikroUser implements User {
  @PrimaryKey()
  _id: string;

  @Property()
  email: string;

  @Property()
  password: string;

  @Property()
  name: string;

  @Property()
  phone?: string | undefined;

  @Enum(() => Role)
  role: Role;

  @Property()
  photo?: string | undefined;

  @Property()
  ownerId?: string | undefined;

  @Property()
  isActive: boolean;

  @Property()
  permissions: Permissions;

  @Property()
  groupIds?: string[];

  constructor(data?: CreateUserDto) {
    if (data) {
      this._id = v4();
      this.name = data.name;
      this.email = data.email;
      this.phone = data.phone;
      this.photo = data.photo;
      this.password = data.password;
      this.ownerId = data.ownerId;
      this.role = data.role;
      this.isActive = data.isActive;
      this.permissions = data.permissions;
      this.groupIds = data.groupIds;
    }
  }
}

export default MikroUser;

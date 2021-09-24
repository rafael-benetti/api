import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import User from '@modules/users/contracts/models/user';
import Role from '@modules/users/contracts/enums/role';
import UserStock from '@modules/users/contracts/models/operator-stock';
import Permissions from '@modules/users/contracts/models/permissions';
import Photo from '@modules/users/contracts/models/photo';
import CreateUserDto from '@modules/users/contracts/dtos/create-user.dto';
import { v4 } from 'uuid';

@Entity({ collection: 'users' })
class MikroUser implements User {
  @PrimaryKey({ name: '_id' })
  id: string;

  @Property({ unique: true })
  email: string;

  @Property()
  password: string;

  @Property()
  name: string;

  @Enum(() => Role)
  role: Role;

  @Property({ nullable: true })
  groupIds?: string[];

  @Property({ nullable: true })
  permissions?: Permissions;

  @Property({ nullable: true })
  stock?: UserStock;

  @Property({ nullable: true })
  photo?: Photo;

  @Property({ nullable: true })
  phoneNumber?: string;

  @Property({ nullable: true })
  isActive?: boolean;

  @Property({ nullable: true })
  ownerId?: string;

  @Property({ nullable: true })
  deviceToken?: string;

  @Property({ nullable: true })
  type?: 'INDIVIDUAL' | 'COMPANY';

  @Property({ nullable: true })
  stateRegistration?: string;

  @Property({ nullable: true })
  document?: string;

  @Property({ nullable: true })
  subscriptionPrice?: string;

  @Property({ nullable: true })
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
      this.document = data.document;
      this.subscriptionPrice = data.subscriptionPrice;
      this.subscriptionExpirationDate = data.subscriptionExpirationDate;
    }
  }
}

export default MikroUser;

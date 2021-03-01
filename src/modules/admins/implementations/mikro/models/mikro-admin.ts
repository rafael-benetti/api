import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateAdminDto from '@modules/admins/contracts/dtos/create-admin.dto';
import Admin from '@modules/admins/contracts/models/admin';
import { v4 } from 'uuid';

@Entity({ tableName: 'admins' })
class MikroAdmin implements Admin {
  @PrimaryKey()
  _id: string;

  @Property()
  email: string;

  @Property()
  password: string;

  @Property()
  name: string;

  constructor(data?: CreateAdminDto) {
    if (data) {
      this._id = v4();
      this.email = data.email;
      this.password = data.password;
      this.name = data.name;
    }
  }
}

export default MikroAdmin;

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateAdminDto from '@modules/admins/contracts/dtos/create-admin.dto';
import Admin from '@modules/admins/contracts/models/admin';
import { v4 } from 'uuid';

@Entity({ tableName: 'admins' })
class MikroAdmin implements Admin {
  @PrimaryKey({ name: '_id' })
  id: string;

  @Property({ unique: true })
  email: string;

  @Property()
  password: string;

  @Property()
  name: string;

  constructor(data?: CreateAdminDto) {
    if (data) {
      this.id = v4();
      this.email = data.email;
      this.password = data.password;
      this.name = data.name;
    }
  }
}

export default MikroAdmin;

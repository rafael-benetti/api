import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import User from '@modules/users/contracts/models/User';

@Entity({ tableName: 'users' })
class MikroUser implements User {
  @PrimaryKey()
  id: string;

  @Property()
  name: string;
}

export default MikroUser;

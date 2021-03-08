import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateGroupDto from '@modules/groups/contracts/dtos/create-group-dto';
import Group from '@modules/groups/contracts/models/group';
import Product from '@modules/products/contracts/models/product';
import { v4 } from 'uuid';

@Entity({ tableName: 'groups' })
class MikroGroup implements Group {
  @PrimaryKey()
  _id: string;

  @Property()
  label?: string;

  @Property()
  isPersonal: boolean;

  @Property()
  stock: Product[];

  @Property()
  ownerId: string;

  constructor(data?: CreateGroupDto) {
    if (data) {
      this._id = v4();
      this.label = data.label;
      this.isPersonal = data.isPersonal !== undefined ? data.isPersonal : false;
      this.stock = [];
      this.ownerId = data.ownerId;
    }
  }
}

export default MikroGroup;

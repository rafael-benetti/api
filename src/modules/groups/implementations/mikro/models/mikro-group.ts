import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateGroupDto from '@modules/groups/contracts/dtos/create-group.dto';
import Group from '@modules/groups/contracts/models/group';
import GroupStock from '@modules/groups/contracts/models/group-stock';
import { v4 } from 'uuid';

@Entity({ collection: 'groups' })
class MikroGroup implements Group {
  @PrimaryKey({ name: '_id' })
  id: string;

  @Property()
  label?: string;

  @Property()
  isPersonal: boolean;

  @Property()
  stock: GroupStock;

  @Property()
  ownerId: string;

  constructor(data?: CreateGroupDto) {
    if (data) {
      this.id = v4();
      this.label = data.label;
      this.isPersonal = data.isPersonal;
      this.stock = {
        prizes: [],
        supplies: [],
      };
      this.ownerId = data.ownerId;
    }
  }
}

export default MikroGroup;

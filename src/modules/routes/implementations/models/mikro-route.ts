import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateRouteDto from '@modules/routes/contracts/dtos/create-route-dto';
import Route from '@modules/routes/contracts/models/route';
import { v4 } from 'uuid';

@Entity({ tableName: 'routes' })
class MikroRoute implements Route {
  @PrimaryKey()
  _id: string;

  @Property()
  label: string;

  @Property()
  groupIds: string[];

  @Property()
  ownerId: string;

  @Property()
  operatorId: string;

  constructor(data?: CreateRouteDto) {
    if (data) {
      this._id = v4();
      this.label = data.label;
      this.groupIds = data.groupIds;
      this.ownerId = data.ownerId;
    }
  }
}

export default MikroRoute;

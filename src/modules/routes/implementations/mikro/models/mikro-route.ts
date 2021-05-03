import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import MikroPointOfSale from '@modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale';
import CreateRouteDto from '@modules/routes/contracts/dtos/create-route.dto';
import { v4 } from 'uuid';
import Route from '../../../contracts/models/route';

@Entity({ collection: 'routes' })
class MikroRoute implements Route {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  label: string;

  @Property()
  operatorId: string;

  @Property()
  groupIds: string[];

  @Property()
  pointsOfSaleIds: string[];

  @OneToMany({
    entity: () => MikroPointOfSale,
    mappedBy: p => p.route,
  })
  pointsOfSale: MikroPointOfSale[];

  @Property()
  ownerId: string;

  constructor(data?: CreateRouteDto) {
    if (data) {
      this.id = data.id || v4();
      this.label = data.label;
      this.pointsOfSaleIds = data.pointsOfSaleIds;
      this.operatorId = data.operatorId;
      this.ownerId = data.ownerId;
      this.groupIds = data.groupIds;
    }
  }
}

export default MikroRoute;

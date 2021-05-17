import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import CreateCollectionDto from '@modules/collections/contracts/dtos/create-collection.dto';
import Collection from '@modules/collections/contracts/entities/collection';
import boxCollection from '@modules/collections/contracts/interfaces/box-collection';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import MikroMachine from '@modules/machines/implementations/mikro/models/mikro-machine';
import MikroPointOfSale from '@modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale';
import MikroRoute from '@modules/routes/implementations/mikro/models/mikro-route';
import MikroUser from '@modules/users/implementations/mikro/models/mikro-user';
import { v4 } from 'uuid';
import Geolocation from '../../../contracts/dtos/geolocation.dto';

@Entity({ collection: 'collections' })
export default class MikroCollection implements Collection {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  previousCollectionId?: string;

  @OneToOne({ name: 'previousCollectionId' })
  previousCollection: MikroCollection;

  @Property()
  machineId: string;

  @OneToOne({ name: 'machineId' })
  machine: MikroMachine;

  @Property()
  groupId: string;

  // TODO: VERIFICAR O PORQUE QUANDO POPULAR VAI COMPLETÃO
  @OneToOne({ name: 'groupId' })
  group: MikroGroup;

  @Property()
  userId: string;

  // TODO: VERIFICAR O PORQUE QUANDO POPULAR VAI COMPLETÃO
  @OneToOne({ name: 'userId' })
  user: MikroUser;

  @Property()
  pointOfSaleId: string;

  @OneToOne({ name: 'pointOfSaleId' })
  pointOfSale: MikroPointOfSale;

  @Property()
  routeId?: string;

  @OneToOne({ name: 'routeId' })
  route?: MikroRoute;

  @Property()
  observations: string;

  @Property()
  date: Date;

  @Property()
  boxCollections: boxCollection[];

  @Property()
  startTime: Date;

  @Property()
  startLocation?: Geolocation;

  @Property()
  endLocation?: Geolocation;

  constructor(data?: CreateCollectionDto) {
    if (data) {
      this.id = v4();
      this.previousCollectionId = data.previousCollectionId;
      this.machineId = data.machineId;
      this.groupId = data.groupId;
      this.userId = data.userId;
      this.pointOfSaleId = data.pointOfSaleId;
      this.routeId = data.routeId;
      this.observations = data.observations;
      this.date = new Date();
      this.boxCollections = data.boxCollections;
      this.startLocation = data.startLocation;
      this.endLocation = data.endLocation;
      this.startTime = data.startTime;
    }
  }
}

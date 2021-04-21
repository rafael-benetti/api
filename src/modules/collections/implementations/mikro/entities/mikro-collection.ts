import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateCollectionDto from '@modules/collections/contracts/dtos/create-collection.dto';
import Collection from '@modules/collections/contracts/entities/collection';
import boxCollection from '@modules/collections/contracts/interfaces/box-collection';
import { v4 } from 'uuid';

@Entity({ collection: 'collections' })
export default class MikroCollection implements Collection {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  previousCollectionId?: string;

  @Property()
  machineId: string;

  @Property()
  groupId: string;

  @Property()
  userId: string;

  @Property()
  pointOfSaleId: string;

  @Property()
  routeId: string;

  @Property()
  observations: string;

  @Property()
  date: Date;

  @Property()
  boxCollections: boxCollection[];

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
    }
  }
}

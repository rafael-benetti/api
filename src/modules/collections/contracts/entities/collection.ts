import { v4 } from 'uuid';
import CreateCollectionDto from '../dtos/create-collection.dto';
import BoxCollection from '../interfaces/box-collection';
import Geolocation from '../dtos/geolocation.dto';

export default class Collection {
  id: string;

  previousCollectionId?: string;

  machineId: string;

  groupId: string;

  userId: string;

  pointOfSaleId: string;

  routeId?: string;

  observations: string;

  date: Date;

  startTime: Date;

  startLocation?: Geolocation;

  endLocation?: Geolocation;

  boxCollections: BoxCollection[];

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

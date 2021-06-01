import BoxCollection from '../interfaces/box-collection';
import Geolocation from './geolocation.dto';

export default interface CreateCollectionDto {
  previousCollectionId?: string;
  machineId: string;
  groupId: string;
  userId: string;
  pointOfSaleId: string;
  routeId?: string;
  observations: string;
  boxCollections: BoxCollection[];
  startTime: Date;
  startLocation?: Geolocation;
  endLocation?: Geolocation;
  reviewedData?: {
    date: Date;
    reviewedBy: string;
    reviewerName: string;
  };
}

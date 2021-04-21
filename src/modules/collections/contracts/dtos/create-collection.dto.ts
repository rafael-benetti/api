import BoxCollection from '../interfaces/box-collection';

export default interface CreateCollectionDto {
  previousCollectionId?: string;
  machineId: string;
  groupId: string;
  userId: string;
  pointOfSaleId: string;
  routeId?: string;
  observations?: string;
  boxCollections: BoxCollection[];
}

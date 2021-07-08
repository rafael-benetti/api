export default interface FindCollectionsDto {
  collectionId?: string;
  pointOfSaleId?: string;
  userId?: string;
  routeId?: string;
  startDate?: Date;
  endDate?: Date;
  groupIds?: string[];
  machineId?: string | string[];
  limit?: number;
  offset?: number;
}

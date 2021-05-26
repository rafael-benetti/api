export default interface FindCollectionsDto {
  collectionId?: string;
  pointOfSaleId?: string;
  startDate?: Date;
  endDate?: Date;
  groupIds?: string[];
  machineId?: string | string[];
  limit?: number;
  offset?: number;
}

export default interface FindCollectionsDto {
  collectionId?: string;
  groupIds?: string[];
  machineId?: string | string[];
  limit?: number;
  offset?: number;
}

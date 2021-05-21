export default interface FindCollectionsDto {
  collectionId?: string;
  groupIds?: string[];
  machineId?: string | string[];
  fields?: string[];
  limit?: number;
  offset?: number;
}

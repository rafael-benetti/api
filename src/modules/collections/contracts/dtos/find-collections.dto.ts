export default interface FindCollectionsDto {
  groupIds: string[];
  machineId?: string | string[];
  limit?: number;
  offset?: number;
}

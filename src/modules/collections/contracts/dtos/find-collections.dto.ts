export default interface FindCollectionsDto {
  groupIds: string[];
  machineId?: string;
  limit?: number;
  offset?: number;
}

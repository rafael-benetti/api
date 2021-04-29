export default interface FindProductLogsDto {
  filters: {
    groupId?: string;
    startDate?: Date;
    endDate?: Date;
  };
  limit?: number;
  offset?: number;
}

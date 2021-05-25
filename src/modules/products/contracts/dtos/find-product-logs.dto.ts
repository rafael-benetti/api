export default interface FindProductLogsDto {
  filters: {
    groupId?: string;
    logType?: 'IN' | 'OUT';
    startDate?: Date;
    endDate?: Date;
  };
  limit?: number;
  offset?: number;
}

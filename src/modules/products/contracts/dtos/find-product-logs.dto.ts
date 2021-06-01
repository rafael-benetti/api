export default interface FindProductLogsDto {
  filters: {
    groupId?: string;
    logType?: 'IN' | 'OUT';
    startDate?: Date;
    endDate?: Date;
    productType?: 'SUPPLY' | 'PRIZE';
  };
  limit?: number;
  offset?: number;
}

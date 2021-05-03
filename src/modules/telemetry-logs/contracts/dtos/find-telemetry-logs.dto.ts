interface FindTelemetryLogsDto {
  filters: {
    groupId?: string | string[];
    machineId?: string | string[];
    pointOfSaleId?: string | string[];
    date?: {
      startDate?: Date;
      endDate: Date;
    };
    maintenance?: boolean;
    type?: 'IN' | 'OUT';
  };
  limit?: number;
  offset?: number;
}

export default FindTelemetryLogsDto;

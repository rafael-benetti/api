interface FindTelemetryLogsDto {
  filters: {
    groupId?: string | string[];
    machineId?: string | string[];
    pointOfSaleId?: string;
    date?: {
      startDate?: Date;
      endDate: Date;
    };
    maintenance?: boolean;
    type?: 'IN' | 'OUT';
  };
  limit?: number;
}

export default FindTelemetryLogsDto;

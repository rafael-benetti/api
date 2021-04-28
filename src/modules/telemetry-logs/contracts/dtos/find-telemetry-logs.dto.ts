interface FindTelemetryLogsDto {
  filters: {
    machineId?: string | string[];
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

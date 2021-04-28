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
}

export default FindTelemetryLogsDto;

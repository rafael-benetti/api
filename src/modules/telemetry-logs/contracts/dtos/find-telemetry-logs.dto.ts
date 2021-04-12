interface FindTelemetryLogsDto {
  filters: {
    machineId?: string;
    startDate?: Date;
    endDate?: Date;
  };
  limit?: number;
  offset?: number;
}

export default FindTelemetryLogsDto;

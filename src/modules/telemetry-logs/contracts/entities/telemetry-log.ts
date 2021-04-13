class TelemetryLog {
  telemetryBoardId: string;

  machineId: string;

  pointOfSaleId?: string;

  routeId?: string;

  groupId: string;

  value: number;

  date: Date;

  pin: string;

  maintenance: boolean;
}

export default TelemetryLog;

class TelemetryLog {
  id: string;

  telemetryBoardId: string;

  machineId?: string;

  pointOfSaleId?: string;

  routeId?: string;

  groupId: string;

  value: number;

  date: Date;

  pin?: string;

  type: 'IN' | 'OUT';

  maintenance: boolean;

  numberOfPlays?: number;

  offline: boolean;
}

export default TelemetryLog;

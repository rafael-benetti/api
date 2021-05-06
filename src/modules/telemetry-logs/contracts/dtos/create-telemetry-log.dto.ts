export default interface CreateTelemetryLogDto {
  telemetryBoardId: string;

  machineId: string;

  pointOfSaleId?: string;

  routeId?: string;

  groupId: string;

  value: number;

  date: Date;

  pin?: string;

  type: 'IN' | 'OUT';

  maintenance: boolean;
}

import { Entity } from '@mikro-orm/core';
import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';

@Entity({ collection: 'telemetry-logs' })
class MikroTelemetryLog implements TelemetryLog {
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

export default MikroTelemetryLog;

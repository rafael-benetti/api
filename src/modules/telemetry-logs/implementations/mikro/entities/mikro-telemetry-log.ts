import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';

@Entity({ collection: 'telemetry-logs' })
class MikroTelemetryLog implements TelemetryLog {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  telemetryBoardId: string;

  @Property()
  machineId: string;

  @Property()
  pointOfSaleId?: string;

  @Property()
  routeId?: string;

  @Property()
  groupId: string;

  @Property()
  value: number;

  @Property()
  date: Date;

  @Property()
  pin: string;

  @Property()
  type: 'IN' | 'OUT';

  @Property()
  maintenance: boolean;
}

export default MikroTelemetryLog;

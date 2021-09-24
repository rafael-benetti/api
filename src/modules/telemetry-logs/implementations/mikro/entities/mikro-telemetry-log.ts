import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateTelemetryLogDto from '@modules/telemetry-logs/contracts/dtos/create-telemetry-log.dto';
import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';
import { v4 } from 'uuid';

@Entity({ collection: 'telemetry-logs' })
class MikroTelemetryLog implements TelemetryLog {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  telemetryBoardId: string;

  @Property()
  machineId: string;

  @Property({ nullable: true })
  pointOfSaleId?: string;

  @Property({ nullable: true })
  routeId?: string;

  @Property()
  groupId: string;

  @Property()
  value: number;

  @Property()
  date: Date;

  @Property({ nullable: true })
  pin?: string;

  @Property()
  type: 'IN' | 'OUT';

  @Property()
  maintenance: boolean;

  @Property({ nullable: true })
  numberOfPlays?: number;

  @Property()
  offline: boolean;

  constructor(data?: CreateTelemetryLogDto) {
    if (data) {
      this.id = v4();
      this.date = data.date;
      this.groupId = data.groupId;
      this.machineId = data.machineId;
      this.maintenance = data.maintenance;
      this.pin = data.pin;
      this.pointOfSaleId = data.pointOfSaleId;
      this.routeId = data.routeId;
      this.telemetryBoardId = data.telemetryBoardId;
      this.type = data.type;
      this.value = data.value;
      this.numberOfPlays = data.numberOfPlays;
      this.offline = data.offline;
    }
  }
}

export default MikroTelemetryLog;

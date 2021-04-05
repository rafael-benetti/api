import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateTelemetryBoardDto from '@modules/telemetry/contracts/dtos/create-telemetry-board.dto';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import { v4 } from 'uuid';

@Entity({ collection: 'telemetry-boards' })
class MikroTelemetryBoard implements TelemetryBoard {
  @PrimaryKey({ name: '_id' })
  id: string;

  @Property()
  ownerId: string;

  @Property()
  groupId: string;

  @Property()
  label: string;

  @Property({ unique: true })
  machineId?: string;

  @Property()
  lastConnection?: Date;

  @Property()
  connectionSignal?: string;

  @Property()
  connectionType?: string;

  constructor(data?: CreateTelemetryBoardDto) {
    if (data) {
      this.id = v4();
      this.ownerId = data.ownerId;
      this.groupId = data.groupId;
      this.label = data.label;
    }
  }
}

export default MikroTelemetryBoard;

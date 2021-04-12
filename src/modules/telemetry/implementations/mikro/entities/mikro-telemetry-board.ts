import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateTelemetryBoardDto from '@modules/telemetry/contracts/dtos/create-telemetry-board.dto';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';

@Entity({ collection: 'telemetry-boards' })
class MikroTelemetryBoard implements TelemetryBoard {
  @PrimaryKey({ name: '_id' })
  id: number;

  @Property()
  ownerId: string;

  @Property()
  groupId: string;

  @Property()
  machineId?: string;

  @Property()
  lastConnection?: Date;

  @Property()
  connectionSignal?: string;

  @Property()
  connectionType?: string;

  constructor(data?: CreateTelemetryBoardDto) {
    if (data) {
      this.ownerId = data.ownerId;
      this.groupId = data.groupId;
    }
  }
}

export default MikroTelemetryBoard;

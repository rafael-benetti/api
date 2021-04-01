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

  @Property({ unique: true })
  machineId?: string | undefined;

  @Property()
  lastConnection?: Date | undefined;

  @Property()
  connectionSignal?: string | undefined;

  @Property()
  connectionType?: string | undefined;

  constructor(data?: CreateTelemetryBoardDto) {
    if (data) {
      this.id = v4();
      this.ownerId = data.ownerId;
    }
  }
}

export default MikroTelemetryBoard;

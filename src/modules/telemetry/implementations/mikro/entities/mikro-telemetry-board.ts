import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import MikroMachine from '@modules/machines/implementations/mikro/models/mikro-machine';
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

  @OneToOne({ name: 'machineId' })
  machine?: MikroMachine;

  @Property()
  lastConnection?: Date;

  @Property()
  connectionStrength?: string;

  @Property()
  connectionType?: string;

  constructor(data?: CreateTelemetryBoardDto) {
    if (data) {
      this.ownerId = data.ownerId;
      this.groupId = data.groupId;
      this.connectionStrength = data.connectionStrength;
      this.connectionType = data.connectionType;
      this.lastConnection = data.lastConnection;
      this.machineId = data.machineId;
    }
  }
}

export default MikroTelemetryBoard;

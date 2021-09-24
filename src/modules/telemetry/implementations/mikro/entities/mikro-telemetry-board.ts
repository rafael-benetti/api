import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import MikroMachine from '@modules/machines/implementations/mikro/models/mikro-machine';
import CreateTelemetryBoardDto from '@modules/telemetry/contracts/dtos/create-telemetry-board.dto';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import MikroUser from '@modules/users/implementations/mikro/models/mikro-user';

@Entity({ collection: 'telemetry-boards' })
class MikroTelemetryBoard implements TelemetryBoard {
  @PrimaryKey({ name: '_id' })
  id: number;

  @Property()
  ownerId: string;

  @OneToOne({ name: 'ownerId', nullable: true })
  owner?: MikroUser;

  @Property()
  groupId: string;

  @OneToOne({ name: 'groupId', nullable: true })
  group?: MikroGroup;

  @Property({ nullable: true })
  integratedCircuitCardId?: string;

  @Property({ nullable: true })
  machineId?: string;

  @OneToOne(() => MikroMachine, mikroMachine => mikroMachine.telemetryBoard, {
    owner: true,
    orphanRemoval: true,
    name: 'machineId',
  })
  machine?: MikroMachine;

  @Property({ nullable: true })
  lastConnection?: Date;

  @Property({ nullable: true })
  connectionStrength?: string;

  @Property({ nullable: true })
  connectionType?: string;

  constructor(data?: CreateTelemetryBoardDto) {
    if (data) {
      this.ownerId = data.ownerId;
      this.groupId = data.groupId;
      this.integratedCircuitCardId = data.integratedCircuitCardId;
      this.connectionStrength = data.connectionStrength;
      this.connectionType = data.connectionType;
      this.lastConnection = data.lastConnection;
      this.machineId = data.machineId;
    }
  }
}

export default MikroTelemetryBoard;

import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import CreateMachineDto from '@modules/machines/contracts/dtos/create-machine.dto';
import Box from '@modules/machines/contracts/models/box';
import Machine from '@modules/machines/contracts/models/machine';
import MikroTelemetryBoard from '@modules/telemetry/implementations/mikro/entities/mikro-telemetry-board';
import { v4 } from 'uuid';

@Entity({ collection: 'machines' })
class MikroMachine implements Machine {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  categoryId?: string;

  @Property()
  boxes: Box[];

  @Property()
  groupId: string;

  @Property()
  telemetryBoardId?: number;

  @OneToOne(
    () => MikroTelemetryBoard,
    mikroTelemetryBoard => mikroTelemetryBoard.machine,
    {
      name: 'telemetryBoardId',
    },
  )
  telemetryBoard?: MikroTelemetryBoard;

  @Property()
  serialNumber: string;

  @Property()
  gameValue: number;

  @Property()
  operatorId?: string;

  @Property()
  locationId?: string;

  @Property()
  ownerId: string;

  @Property()
  categoryLabel: string;

  @Property()
  isActive: boolean;

  @Property()
  maintenance: boolean;

  constructor(data?: CreateMachineDto) {
    if (data) {
      this.id = v4();
      this.categoryId = data.categoryId;
      this.boxes = data.boxes;
      this.groupId = data.groupId;
      this.serialNumber = data.serialNumber;
      this.gameValue = data.gameValue;
      this.operatorId = data.operatorId;
      this.locationId = data.locationId;
      this.ownerId = data.ownerId;
      this.categoryLabel = data.categoryLabel;
      this.isActive = data.isActive;
      this.telemetryBoardId = data.telemetryBoardId;
      this.maintenance = false;
    }
  }
}

export default MikroMachine;

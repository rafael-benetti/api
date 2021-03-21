import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateMachineDto from '@modules/machines/contracts/dtos/create-machine.dto';
import Box from '@modules/machines/contracts/models/box';
import Machine from '@modules/machines/contracts/models/machine';
import { v4 } from 'uuid';

@Entity({ collection: 'machines' })
class MikroMachine implements Machine {
  @PrimaryKey()
  id: string;

  @Property()
  categoryId: string;

  @Property()
  boxes: Box[];

  @Property()
  groupId: string;

  @Property()
  serialNumber: string;

  @Property()
  gameValue: number;

  @Property()
  operatorId: string;

  @Property()
  locationId: string;

  @Property()
  ownerId: string;

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
    }
  }
}

export default MikroMachine;

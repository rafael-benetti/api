import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateMachineDto from '@modules/machines/contracts/dtos/create-machine.dto';
import Machine from '@modules/machines/contracts/models/machine';
import { v4 } from 'uuid';

@Entity({ tableName: 'machines' })
class MikroMachine implements Machine {
  @PrimaryKey()
  _id: string;

  @Property()
  categoryId: string;

  @Property()
  groupId: string;

  @Property()
  pointOfSaleId?: string;

  @Property()
  ownerId: string;

  @Property()
  serialNumber: string;

  @Property()
  deleted: boolean;

  constructor(data?: CreateMachineDto) {
    if (data) {
      this._id = v4();
      this.categoryId = data.categoryId;
      this.groupId = data.groupId;
      this.pointOfSaleId = data.pointOfSaleId;
      this.ownerId = data.ownerId;
      this.serialNumber = data.serialNumber;
      this.deleted = false;
    }
  }
}

export default MikroMachine;

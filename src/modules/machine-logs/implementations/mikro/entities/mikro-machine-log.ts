import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateMachineLogDto from '@modules/machine-logs/contracts/dtos/create-machine-log.dto';
import MachineLog from '@modules/machine-logs/contracts/entities/machine-log';
import MachineLogType from '@modules/machine-logs/contracts/enums/machine-log-type';
import { v4 } from 'uuid';

@Entity({ collection: 'machine-log' })
class MikroMachineLog implements MachineLog {
  @PrimaryKey()
  id: string;

  @Property()
  machineId: string;

  @Property()
  groupId: string;

  @Property()
  observations: string;

  @Property()
  type: MachineLogType;

  @Property()
  createdAt: Date;

  @Property()
  createdBy: string;

  constructor(data?: CreateMachineLogDto) {
    if (data) {
      this.id = v4();
      this.createdAt = data.createdAt;
      this.createdBy = data.createdBy;
      this.observations = data.observations;
      this.type = data.type;
      this.machineId = data.machineId;
      this.groupId = data.groupId;
    }
  }
}

export default MikroMachineLog;

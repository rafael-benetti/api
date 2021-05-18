import MachineLogType from '../enums/machine-log-type';

export default class MachineLog {
  id: string;

  machineId: string;

  groupId: string;

  observations: string;

  type: MachineLogType;

  createdAt: Date;

  createdBy: string;
}

import MachineLogType from '../enums/machine-log-type';

export default class MachineLog {
  id: string;

  machineId: string;

  groupId: string;

  observations: string;

  quantity: number;

  type: MachineLogType;

  createdAt: Date;

  createdBy: string;
}

import MachineLogType from '../enums/machine-log-type';

export default interface CreateMachineLogDto {
  machineId: string;

  groupId: string;

  observations: string;

  type: MachineLogType;

  createdAt: Date;

  createdBy: string;
}

import MachineLogType from '../enums/machine-log-type';

export default interface CreateMachineLogDto {
  machineId: string;

  groupId: string;

  observation: string;

  type: MachineLogType;

  createdAt: Date;

  createdBy: string;
}

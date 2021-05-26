import MachineLogType from '../enums/machine-log-type';

export default interface CreateMachineLogDto {
  machineId: string;

  groupId: string;

  observations: string;

  type: MachineLogType;

  createdBy: string;

  quantity: number;
}

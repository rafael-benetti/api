import MachineLogType from '../enums/machine-log-type';

export default interface FindMachineLogsDto {
  machineId?: string | string[];
  groupId: string | string[];
  startDate?: Date;
  endDate?: Date;
  type?: MachineLogType;
  populate?: string[];
  fields?: string[];
  limit?: number;
  offset?: number;
}

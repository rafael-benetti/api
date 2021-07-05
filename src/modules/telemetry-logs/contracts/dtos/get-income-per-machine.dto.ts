export default interface GetIncomePerMachineDto {
  groupIds: string[];
  machineId?: string;
  startDate?: Date;
  endDate?: Date;
}

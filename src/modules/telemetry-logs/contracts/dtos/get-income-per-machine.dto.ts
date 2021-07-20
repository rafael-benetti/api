export default interface GetIncomePerMachineDto {
  groupIds: string[];
  machineId?: string;
  pointOfSaleId?: string;
  startDate?: Date;
  endDate?: Date;
}

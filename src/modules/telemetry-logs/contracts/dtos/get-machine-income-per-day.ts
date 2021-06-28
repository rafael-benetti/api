export default interface GetMachineIncomePerDay {
  groupIds: string[];
  withHours: boolean;
  machineId: string;
  type?: 'IN' | 'OUT';
  startDate?: Date;
  endDate?: Date;
}

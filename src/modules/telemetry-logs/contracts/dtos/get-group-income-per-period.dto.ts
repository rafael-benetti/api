export default interface GetGroupIncomePerPeriodDto {
  groupIds: string[];
  machineIds?: string[];
  pointsOfSaleIds?: string[];
  routeIds?: string;
  type: 'IN' | 'OUT';
  startDate?: Date;
  endDate?: Date;
  withHours: boolean;
}

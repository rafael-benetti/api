export default interface GetIncomePerCounterTypeDto {
  groupIds: string[];
  startDate?: Date;
  endDate?: Date;
  pointsOfSaleIds?: string[];
}

export default interface GetPointOfSaleIncomePerDateDto {
  withHours: boolean;
  pointOfSaleId: string;
  type?: 'IN' | 'OUT';
  startDate: Date;
  endDate: Date;
}

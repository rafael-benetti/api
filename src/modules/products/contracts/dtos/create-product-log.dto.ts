export default interface CreateProductLogDto {
  groupId: string;
  productName: string;
  productType: 'SUPPLY' | 'PRIZE';
  quantity: number;
  logType: 'IN' | 'OUT';
  cost: number;
}

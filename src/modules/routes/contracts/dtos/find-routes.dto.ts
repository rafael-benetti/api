export default interface FindRoutesDto {
  id?: string;
  operatorId?: string;
  ownerId?: string;
  label?: string;
  pointsOfSaleId?: string;
  routeId?: string;
  groupIds?: string[];
  populate?: string[];
}

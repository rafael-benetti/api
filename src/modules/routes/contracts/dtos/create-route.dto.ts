export default interface CreateRouteDto {
  id?: string;
  label: string;
  operatorId?: string;
  groupIds: string[];
  pointsOfSaleIds: string[];
  ownerId: string;
}

export default interface CreateRouteDto {
  label: string;
  operatorId: string;
  groupIds: string[];
  pointsOfSaleIds: string[];
  ownerId: string;
}

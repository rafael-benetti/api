export default interface CreateRouteDto {
  label: string;
  groupIds: string[];
  ownerId: string;
  operatorId?: string;
}

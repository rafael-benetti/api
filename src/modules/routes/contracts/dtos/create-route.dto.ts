export default interface CreateRouteDto {
  label: string;
  operatorId: string;
  groupIds: string[];
  machineIds: string[];
  ownerId: string;
}

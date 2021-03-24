export default interface CreateRouteDto {
  id: string;
  label: string;
  operatorId: string;
  groupIds: string[];
  machineIds: string[];
  ownerId: string;
}

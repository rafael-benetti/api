export default interface FindRoutesDto {
  id?: string;
  operatorId?: string;
  ownerId?: string;
  label?: string;
  machineIds?: string | string[];
  groupIds?: string[];
  populate?: string[];
}

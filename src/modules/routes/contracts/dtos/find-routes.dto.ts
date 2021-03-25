export default interface FindRoutesDto {
  id?: string;
  operatorId?: string;
  ownerId?: string;
  label?: string;
  groupIds?: string[];
  populate?: string[];
}

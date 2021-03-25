export default interface FindMachinesDto {
  id?: string | string[];
  ownerId?: string;
  operatorId?: string;
  groupIds?: string[];
  categoryId?: string;
  routeId?: string;
  pointOfSaleId?: string;
  serialNumber?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

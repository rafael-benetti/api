export default interface FindMachinesDto {
  id?: string;
  ownerId?: string;
  operatorId?: string;
  groupIds?: string[];
  filters?: {
    categoryId?: string;
    groupId?: string;
    routeId?: string;
    pointOfSaleId?: string;
    serialNumber?: string;
  };
}

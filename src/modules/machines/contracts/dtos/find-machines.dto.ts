export default interface FindMachinesDto {
  id?: string | string[];
  ownerId?: string;
  operatorId?: string;
  groupIds?: string[];
  categoryId?: string;
  routeId?: string;
  telemetryBoardId?: number;
  telemetryStatus?: 'ONLINE' | 'OFFLINE' | 'VIRGIN' | 'NO_TELEMETRY';
  pointOfSaleId?: string | string[];
  serialNumber?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  populate?: string[];
}

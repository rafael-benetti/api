interface FindPointOfSaleDto {
  by?: 'id' | 'ownerId' | 'groupId' | 'routeId';
  value?: string | string[];
  populate?: string[];
  fields?: string[];
  filters?: {
    ownerId?: string;
    label?: string;
    groupId?: string | string[];
    offset?: number;
    limit?: number;
  };
}

export default FindPointOfSaleDto;

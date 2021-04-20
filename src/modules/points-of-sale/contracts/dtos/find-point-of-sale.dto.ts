interface FindPointOfSaleDto {
  by: 'id' | 'ownerId' | 'groupId';
  value: string | string[];
  populate?: string[];
  filters: {
    label: string;
    groupId: string;
    offset: number;
    limit: number;
  };
}

export default FindPointOfSaleDto;

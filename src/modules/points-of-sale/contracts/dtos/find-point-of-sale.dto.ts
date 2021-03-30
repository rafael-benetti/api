interface FindPointOfSaleDto {
  by: 'id' | 'ownerId' | 'groupId';
  value: string | string[];
  populate?: string[];
}

export default FindPointOfSaleDto;

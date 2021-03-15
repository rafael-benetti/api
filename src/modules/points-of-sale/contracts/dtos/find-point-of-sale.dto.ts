interface FindPointOfSaleDto {
  by: 'id' | 'ownerId' | 'groupId';
  value: string;
  populate?: string[];
}

export default FindPointOfSaleDto;

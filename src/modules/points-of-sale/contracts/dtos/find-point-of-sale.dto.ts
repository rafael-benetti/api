interface FindPointOfSaleDto {
  by: 'id';
  value: string;
  populate?: string[];
}

export default FindPointOfSaleDto;

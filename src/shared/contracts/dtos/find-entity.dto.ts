interface FindEntityDto<T> {
  limit?: number;
  offset?: number;
  filters: Partial<T>;
  populate?: string[];
}

export default FindEntityDto;

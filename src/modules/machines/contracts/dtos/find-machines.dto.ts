interface FindMachinesDto {
  limit?: number;
  offset?: number;
  filters: {
    ownerId?: string;
    groupId?: string;
    pointOfSaleId?: string;
    categoryId?: string;
  };
}

export default FindMachinesDto;

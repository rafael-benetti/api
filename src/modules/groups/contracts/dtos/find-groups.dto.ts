interface FindGroupsDto {
  filters: {
    ids?: string[];
    ownerId?: string;
  };
  limit?: number;
  offset?: number;
  populate?: string[];
}

export default FindGroupsDto;

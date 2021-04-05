interface FindGroupsDto {
  filters: {
    ids?: string[];
    ownerId?: string;
    isPersonal?: boolean;
  };
  limit?: number;
  offset?: number;
  populate?: string[];
}

export default FindGroupsDto;

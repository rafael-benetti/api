interface FindGroupsDto {
  filters: {
    ids?: string[];
    ownerId?: string;
    isPersonal?: boolean;
  };
  fields?: string[];
  limit?: number;
  offset?: number;
  populate?: string[];
}

export default FindGroupsDto;

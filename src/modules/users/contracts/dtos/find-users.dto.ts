import Role from '../enums/role';

interface FindUsersDto {
  filters: {
    role?: Role;
    groupIds?: string[];
    ownerId?: string;
  };
  fields?: string[];
  limit?: number;
  offset?: number;
  populate?: string[];
}

export default FindUsersDto;

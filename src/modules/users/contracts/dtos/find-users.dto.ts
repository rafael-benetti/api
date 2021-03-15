import Role from '../enums/role';

interface FindUsersDto {
  filters: {
    role?: Role;
    groupId?: string;
  };
  limit?: number;
  offset?: number;
  populate?: string[];
}

export default FindUsersDto;

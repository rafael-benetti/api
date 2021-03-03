import Group from '../models/group';

interface FindGroupDto {
  limit?: number;
  offset?: number;
  filters: Partial<Group>;
  populate?: string[];
}

export default FindGroupDto;

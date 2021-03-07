import User from '../models/user';

interface FindUserDto {
  limit?: number;
  offset?: number;
  filters: Partial<User>;
  populate?: string[];
}

export default FindUserDto;

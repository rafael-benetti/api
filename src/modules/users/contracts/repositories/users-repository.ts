import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import CreateUserDto from '../dtos/create-user-dto';
import User from '../models/user';

interface UsersRepository {
  create(data: CreateUserDto): User;
  find(data: FindEntityDto<User>): Promise<User[]>;
  findOne(data: FindEntityDto<User>): Promise<User | undefined>;
  findByGroupIds(groupIds: string[]): Promise<User[]>;
  save(user: User): void;
}

export default UsersRepository;

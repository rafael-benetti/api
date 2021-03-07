import CreateUserDto from '../dtos/create-user-dto';
import FindUserDto from '../dtos/find-user-dto';
import User from '../models/user';

interface UsersRepository {
  create(data: CreateUserDto): User;
  find(data: FindUserDto): Promise<User[]>;
  findOne(data: FindUserDto): Promise<User | undefined>;
  findByGroupIds(groupIds: string[]): Promise<User[]>;
  save(user: User): void;
}

export default UsersRepository;

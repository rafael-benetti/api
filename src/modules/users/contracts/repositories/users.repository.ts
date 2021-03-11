import CreateUserDto from '../dtos/create-user.dto';
import FindUserDto from '../dtos/find-user.dto';
import FindUsersDto from '../dtos/find-users.dto';
import User from '../models/user';

interface UsersRepository {
  create(data: CreateUserDto): User;
  findOne(data: FindUserDto): Promise<User | undefined>;
  find(data: FindUsersDto): Promise<User[]>;
  save(data: User): void;
  delete(data: User): void;
}

export default UsersRepository;

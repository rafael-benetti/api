import CreateUserDto from '../dtos/create-user-dto';
import User from '../models/user';

interface UsersRepository {
  create(data: CreateUserDto): User;
  findById(userId: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByOwnerId(ownerId: string): Promise<User[]>;
  findByGroupIds(groupIds: string[]): Promise<User[]>;
  save(user: User): void;
}

export default UsersRepository;

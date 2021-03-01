import CreateUserDto from '../dtos/create-user-dto';
import User from '../models/user';

interface UsersRepository {
  create(data: CreateUserDto): Promise<User>;
  findById(userId: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  find(userId: string): Promise<User[]>;
  save(user: User): Promise<User>;
}

export default UsersRepository;

import CreateUserDto from '@modules/users/contracts/dtos/create-user.dto';
import FindUserDto from '@modules/users/contracts/dtos/find-user.dto';
import FindUsersDto from '@modules/users/contracts/dtos/find-users.dto';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroUser from '../models/mikro-user';
import UserMapper from '../models/user-mapper';

class MikroUsersRepository implements UsersRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroUser);

  create(data: CreateUserDto): User {
    const user = new MikroUser(data);
    this.repository.persist(user);
    return UserMapper.toApi(user);
  }

  async findOne(data: FindUserDto): Promise<User | undefined> {
    const user = await this.repository.findOne(
      {
        [data.by]: data.value,
      },
      data.populate,
    );

    return user ? UserMapper.toApi(user) : undefined;
  }

  async find(data: FindUsersDto): Promise<User[]> {
    const users = await this.repository.find(
      {
        role: data.filters.role,
      },
      {
        limit: data.limit,
        offset: data.offset,
        populate: data.populate,
      },
    );

    return users.map(user => UserMapper.toApi(user));
  }

  save(data: User): void {
    const user = UserMapper.toOrm(data);
    this.repository.persist(user);
  }

  delete(data: User): void {
    const user = UserMapper.toOrm(data);
    this.repository.remove(user);
  }
}

export default MikroUsersRepository;

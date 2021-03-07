import createUserDto from '@modules/users/contracts/dtos/create-user-dto';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import { container } from 'tsyringe';
import MikroUser from '../models/mikro-user';

class MikroUsersRepository implements UsersRepository {
  private entityManeger = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroUser);

  async find({
    filters,
    limit,
    offset,
    populate,
  }: FindEntityDto<User>): Promise<User[]> {
    const users = await this.entityManeger.find(
      { ...filters },
      {
        limit,
        offset,
        populate,
      },
    );

    return users;
  }

  async findOne({ filters }: FindEntityDto<User>): Promise<User | undefined> {
    const user = await this.entityManeger.findOne({
      ...filters,
    });

    return user ? MikroMapper.map(user) : undefined;
  }

  async findByGroupIds(groupIds: string[]): Promise<User[]> {
    const mikroUsers = await this.entityManeger.find({
      groupIds,
    });

    return mikroUsers.map(mikroUser => MikroMapper.map(mikroUser));
  }

  create(data: createUserDto): User {
    const user = new MikroUser(data);
    this.entityManeger.persist(user);
    return MikroMapper.map(user);
  }

  save(user: User): void {
    this.entityManeger.persist(user);
  }
}

export default MikroUsersRepository;

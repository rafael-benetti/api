import createUserDto from '@modules/users/contracts/dtos/create-user-dto';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroUser from '../models/mikro-user';

class MikroUsersRepository implements UsersRepository {
  private ormProvider: MikroOrmProvider;

  constructor() {
    this.ormProvider = container.resolve<MikroOrmProvider>('OrmProvider');
  }

  async findByGroupIds(groupIds: string[]): Promise<User[]> {
    const mikroUsers = await this.ormProvider.entityManager.find(MikroUser, {
      groupIds,
    });

    return mikroUsers.map(mikroUser => MikroMapper.map(mikroUser));
  }

  async findByOwnerId(ownerId: string): Promise<User[]> {
    const mikroUsers = await this.ormProvider.entityManager.find(MikroUser, {
      ownerId,
    });

    return mikroUsers.map(mikroUser => MikroMapper.map(mikroUser));
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const mikroUser = await this.ormProvider.entityManager.findOne(MikroUser, {
      email,
    });

    if (mikroUser) return MikroMapper.map(mikroUser);

    return undefined;
  }

  async findById(userId: string): Promise<User | undefined> {
    const user = await this.ormProvider.entityManager.findOne(MikroUser, {
      _id: userId,
    });

    if (user) return MikroMapper.map(user);

    return undefined;
  }

  async create(data: createUserDto): Promise<User> {
    const user = new MikroUser(data);

    this.ormProvider.entityManager.persist(user);

    await this.ormProvider.commit();

    return MikroMapper.map(user);
  }

  async save(user: User): Promise<User> {
    const mikroUser = MikroMapper.map(user);

    this.ormProvider.entityManager.persist(mikroUser);

    await this.ormProvider.commit();

    return MikroMapper.map(mikroUser);
  }
}

export default MikroUsersRepository;

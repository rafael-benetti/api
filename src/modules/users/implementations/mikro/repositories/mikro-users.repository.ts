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
      {
        populate: data.populate,
        fields: data.fields,
      },
    );

    return user ? UserMapper.toApi(user) : undefined;
  }

  async find(data: FindUsersDto): Promise<User[]> {
    const query: { [key: string]: unknown } = {};

    if (data.filters.role) query.role = data.filters.role;
    if (data.filters.ownerId) query.ownerId = data.filters.ownerId;
    if (data.filters.groupIds)
      query.groupIds = {
        $in: data.filters.groupIds,
      };

    const users = await this.repository.find(
      {
        ...query,
      },
      {
        limit: data.limit,
        offset: data.offset,
        populate: data.populate,
        fields: data.fields,
      },
    );

    return users.map(user => UserMapper.toApi(user));
  }

  async usersInventoryByProduct({ filters }: FindUsersDto): Promise<
    {
      prizeId: string;
      prizeLabel: string;
      totalPrizes: string;
    }[]
  > {
    const stages: unknown[] = [
      {
        $match: {
          groupIds: {
            $in: filters.groupIds,
          },
        },
      },
      {
        $unwind: '$stock.prizes',
      },
      {
        $group: {
          _id: {
            id: '$stock.prizes.id',
            label: '$stock.prizes.label',
          },
          totalPrizes: {
            $sum: '$stock.prizes.quantity',
          },
        },
      },
      {
        $project: {
          prizeId: '$_id.id',
          prizeLabel: '$_id.label',
          totalPrizes: 1,
          _id: 0,
        },
      },
    ];

    const response = await this.repository.aggregate(stages);

    return response;
  }

  async usersInventoryBySupplies({ filters }: FindUsersDto): Promise<
    {
      supplieId: string;
      supplieLabel: string;
      totalSupplies: string;
    }[]
  > {
    const stages: unknown[] = [
      {
        $match: {
          groupIds: {
            $in: filters.groupIds,
          },
        },
      },
      {
        $unwind: '$stock.supplies',
      },
      {
        $group: {
          _id: {
            id: '$stock.supplies.id',
            label: '$stock.supplies.label',
          },
          totalSupplies: {
            $sum: '$stock.supplies.quantity',
          },
        },
      },
      {
        $project: {
          supplieId: '$_id.id',
          supplieLabel: '$_id.label',
          totalSupplies: 1,
          _id: 0,
        },
      },
    ];

    const response = await this.repository.aggregate(stages);

    return response;
  }

  save(data: User): void {
    const reference = this.repository.getReference(data.id);
    const user = this.repository.assign(reference, data);
    this.repository.persist(user);
  }

  delete(data: User): void {
    const user = UserMapper.toOrm(data);
    this.repository.remove(user);
  }
}

export default MikroUsersRepository;

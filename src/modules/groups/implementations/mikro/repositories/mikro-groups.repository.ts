import CreateGroupDto from '@modules/groups/contracts/dtos/create-group.dto';
import FindGroupDto from '@modules/groups/contracts/dtos/find-group.dto';
import FindGroupsDto from '@modules/groups/contracts/dtos/find-groups.dto';
import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import GroupMapper from '../models/group-mapper';
import MikroGroup from '../models/mikro-group';

class MikroGroupsRepository implements GroupsRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroGroup);

  create(data: CreateGroupDto): Group {
    const group = new MikroGroup(data);
    this.repository.persist(group);
    return GroupMapper.toApi(group);
  }

  async findOne(data: FindGroupDto): Promise<Group | undefined> {
    const group = await this.repository.findOne(
      {
        [data.by]: data.value,
      },
      data.populate,
    );

    return group ? GroupMapper.toApi(group) : undefined;
  }

  async find(data: FindGroupsDto): Promise<Group[]> {
    const { ownerId, isPersonal, ids } = data.filters;

    const query: {
      [key: string]: unknown;
    } = {};

    if (ownerId) query.ownerId = ownerId;
    if (isPersonal !== undefined) query.isPersonal = isPersonal;
    if (ids) query.id = ids;

    const groups = await this.repository.find(
      {
        ...query,
      },
      {
        limit: data.limit,
        offset: data.offset,
        populate: data.populate,
        ...(data.fields && { fields: data.fields }),
      },
    );

    return groups.map(group => GroupMapper.toApi(group));
  }

  async groupsInvertoryByProduct({ filters }: FindGroupsDto): Promise<
    {
      prizeId: string;
      prizeLabel: string;
      totalPrizes: string;
    }[]
  > {
    const stages: unknown[] = [
      {
        $match: {
          _id: {
            $in: filters.ids,
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

  async groupsInvertoryBySupplies({ filters }: FindGroupsDto): Promise<
    {
      supplieId: string;
      supplieLabel: string;
      totalSupplies: string;
    }[]
  > {
    const stages: unknown[] = [
      {
        $match: {
          _id: {
            $in: filters.ids,
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

  save(data: Group): void {
    const reference = this.repository.getReference(data.id);
    const group = this.repository.assign(reference, data);
    this.repository.persist(group);
  }

  delete(data: Group): void {
    const reference = this.repository.getReference(data.id);
    const group = this.repository.assign(reference, data);
    this.repository.remove(group);
  }
}

export default MikroGroupsRepository;

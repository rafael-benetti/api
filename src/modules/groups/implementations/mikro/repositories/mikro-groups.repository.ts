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

  save(data: Group): void {
    const group = GroupMapper.toOrm(data);
    this.repository.persist(group);
  }

  delete(data: Group): void {
    const group = GroupMapper.toOrm(data);
    this.repository.remove(group);
  }
}

export default MikroGroupsRepository;

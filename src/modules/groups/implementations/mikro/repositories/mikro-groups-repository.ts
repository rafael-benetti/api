import CreateGroupDto from '@modules/groups/contracts/dtos/create-group-dto';
import FindGroupDto from '@modules/groups/contracts/dtos/find-group.dto';
import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroGroup from '../models/mikro-group';

class MikroGroupsRepository implements GroupsRepository {
  private entityManager = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroGroup);

  create(data: CreateGroupDto): Group {
    const mikroGroup = new MikroGroup(data);
    this.entityManager.persist(mikroGroup);
    return MikroMapper.map(mikroGroup);
  }

  async findOne({
    filters,
    populate,
  }: FindGroupDto): Promise<Group | undefined> {
    const group = await this.entityManager.findOne(
      {
        ...filters,
      },
      populate,
    );

    return group ? MikroMapper.map(group) : undefined;
  }

  async find({
    filters,
    limit,
    offset,
    populate,
  }: FindGroupDto): Promise<Group[]> {
    const groups = await this.entityManager.find(
      {
        ...filters,
      },
      {
        limit,
        offset,
        populate,
      },
    );

    return groups.map(group => MikroMapper.map(group));
  }

  save(group: Group): void {
    const mikroGroup = MikroMapper.map(group);
    this.entityManager.persist(mikroGroup);
  }
}

export default MikroGroupsRepository;

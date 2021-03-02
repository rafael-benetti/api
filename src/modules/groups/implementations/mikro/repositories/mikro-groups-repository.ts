import logger from '@config/logger';
import CreateGroupDto from '@modules/groups/contracts/dtos/create-group-dto';
import FindByLabelDto from '@modules/groups/contracts/dtos/find-by-label-dto';
import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroGroup from '../models/mikro-group';

class MikroGroupsRepository implements GroupsRepository {
  private ormProvider: MikroOrmProvider;

  constructor() {
    this.ormProvider = container.resolve<MikroOrmProvider>('OrmProvider');
  }

  save(group: Group): void {
    const mikroGroup = MikroMapper.map(group);
    logger.info(mikroGroup);
    this.ormProvider.entityManager.persist(mikroGroup);
  }

  async findByLabel({
    label,
    ownerId,
  }: FindByLabelDto): Promise<Group | undefined> {
    const mikroGroup = await this.ormProvider.entityManager.findOne(
      MikroGroup,
      {
        ownerId,
        label,
      },
    );

    if (mikroGroup) return MikroMapper.map(mikroGroup);

    return undefined;
  }

  async findById(groupId: string): Promise<Group | undefined> {
    const group = await this.ormProvider.entityManager.findOne(MikroGroup, {
      _id: groupId,
    });

    if (group) return MikroMapper.map(group);

    return undefined;
  }

  async find(groupIds: string[]): Promise<Group[]> {
    const mikroGroups = await this.ormProvider.entityManager.find(MikroGroup, {
      _id: groupIds,
    });

    const groups = mikroGroups.map(group => MikroMapper.map(group));

    return groups;
  }

  async findByOwnerId(ownerId: string): Promise<Group[]> {
    const mikroGroups = await this.ormProvider.entityManager.find(MikroGroup, {
      ownerId,
    });

    const groups = mikroGroups.map(group => MikroMapper.map(group));

    return groups;
  }

  create(data: CreateGroupDto): Group {
    const mikroGroup = new MikroGroup(data);
    this.ormProvider.entityManager.persist(mikroGroup);
    return MikroMapper.map(mikroGroup);
  }
}

export default MikroGroupsRepository;

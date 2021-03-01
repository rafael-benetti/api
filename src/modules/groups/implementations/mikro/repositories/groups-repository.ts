import CreateGroupDto from '@modules/groups/contracts/dtos/create-group-dto';
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

  async create(data: CreateGroupDto): Promise<Group> {
    const mikroGroup = new MikroGroup(data);

    this.ormProvider.entityManager.persist(mikroGroup);

    await this.ormProvider.commit();

    return MikroMapper.map(mikroGroup);
  }
}

export default MikroGroupsRepository;

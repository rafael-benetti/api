import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Group from '@modules/groups/contracts/models/group';
import Redis from 'ioredis';
import TypeCompaniesRepository from '../typeorm/repositories/type-companies.repository';

@injectable()
class UserScript {
  private client = new Redis();

  constructor(
    @inject('TypeCompaniesRepository')
    private typeCompaniesRepository: TypeCompaniesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    this.ormProvider.clear();
    const companies = await this.typeCompaniesRepository.find();

    companies.forEach(async typeCompany => {
      // ANCHOR: CHECAR SE REALMENTE É ISSO
      const isPersonalArray = ['Pessoal', '1.01 BLACK ENTERTAINMENT'];

      const ownerId = (await this.client.get(
        `@users:${typeCompany.ownerId}`,
      )) as string;

      const group = new Group({
        isPersonal: isPersonalArray.includes(typeCompany.name),
        label: typeCompany.name,
        ownerId,
      });

      await this.client.set(`@groups:${typeCompany.id}`, `${group.id}`);

      this.groupsRepository.create(group);
    });

    await this.ormProvider.commit();
  }

  async setOwnerId(): Promise<void> {
    const groups = await this.groupsRepository.find({
      filters: {},
    });

    groups.forEach(async group => {
      const ownerId = (await this.client.get(
        `@users:${group.ownerId}`,
      )) as string;

      group.ownerId = ownerId;
    });
  }
}

export default UserScript;

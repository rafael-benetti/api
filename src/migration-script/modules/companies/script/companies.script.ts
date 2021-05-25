/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Redis from 'ioredis';
import TypeCompaniesRepository from '../typeorm/repositories/type-companies.repository';

@injectable()
class CompaniesScript {
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
    const companies = await this.typeCompaniesRepository.find();

    for (const typeCompany of companies) {
      // ANCHOR: CHECAR SE REALMENTE É ISSO
      const isPersonalArray = ['Pessoal', '1.01 BLACK ENTERTAINMENT'];

      const group = this.groupsRepository.create({
        label: typeCompany.name,
        isPersonal: isPersonalArray.includes(typeCompany.name),
        ownerId: typeCompany.ownerId.toString(),
      });

      await this.client.set(`@groups:${typeCompany.id}`, `${group.id}`);
    }

    await this.ormProvider.commit();
    this.ormProvider.clear();
  }

  async setOwnerId(): Promise<void> {
    this.ormProvider.clear();

    const groups = await this.groupsRepository.find({
      filters: {},
    });

    for (const group of groups) {
      const ownerId = (await this.client.get(
        `@users:${group.ownerId}`,
      )) as string;

      group.ownerId = ownerId;

      this.groupsRepository.save(group);
    }

    await this.ormProvider.commit();
  }
}

export default CompaniesScript;

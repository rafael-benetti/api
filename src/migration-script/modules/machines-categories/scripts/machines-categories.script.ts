import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Redis from 'ioredis';
import TypeCompaniesRepository from 'migration-script/modules/companies/typeorm/repositories/type-companies.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import TypeUsersRepository from 'migration-script/modules/users/typeorm/repostories/type-users-repository';
import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Counter from '@modules/machines/contracts/models/counter';
import CounterType from '@modules/counter-types/contracts/models/counter-type';
import MachineCategoriesRepository from '../typeorm/repositories/type-machine-categories.repository';

@injectable()
class UserScript {
  private client = new Redis();

  constructor(
    @inject('TypeCompaniesRepository')
    private typeCompaniesRepository: TypeCompaniesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: CategoriesRepository,

    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: MachineCategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('TypeUsersRepository')
    private typeUsersRepository: TypeUsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    this.ormProvider.clear();

    const typeUsers = await this.typeCompaniesRepository.find();

    const typeOwners = typeUsers.filter(
      typeUser => typeUser.id === typeUser.ownerId,
    );

    typeOwners.forEach(async typeOwner => {
      const ownerId = (await this.client.get(
        `@users:${typeOwner.id}`,
      )) as string;

      const typeMachineCategories = await this.machineCategoriesRepository.listAllCategories(
        typeOwner.id,
      );

      typeMachineCategories.forEach(async typeMachineCategory => {
        const counters: any[] = [];
        const counterTypes = await this.counterTypesRepository.find({
          ownerId,
        });

        if (
          typeMachineCategory.name === 'Vintage' ||
          typeMachineCategory.name === 'Tomacat' ||
          typeMachineCategory.name === 'Magic Bear' ||
          typeMachineCategory.name === 'Luck Star' ||
          typeMachineCategory.name === 'Grua Lucky Star' ||
          typeMachineCategory.name === 'Grua Black' ||
          typeMachineCategory.name === 'Black' ||
          typeMachineCategory.name === 'Big Mega Plush' ||
          typeMachineCategory.name === 'Big Black'
        ) {
          for (x in 30) {
          }
        }

        this.categoriesRepository.create({
          label: typeMachineCategory.name,
          ownerId,
          boxes: [],
        });
      });
    });

    await this.ormProvider.commit();
  }
}

export default UserScript;

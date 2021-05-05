import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Redis from 'ioredis';
import TypeCompaniesRepository from 'migration-script/modules/companies/typeorm/repositories/type-companies.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import Role from '@modules/users/contracts/enums/role';
import TypeUsersRepository from 'migration-script/modules/users/typeorm/repostories/type-users-repository';
import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
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

/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import Role from '@modules/users/contracts/enums/role';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import { inject, injectable } from 'tsyringe';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import Redis from 'ioredis';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import AppError from '@shared/errors/app-error';
import TypeUsersRepository from '../typeorm/repostories/type-users-repository';

@injectable()
class UsersScript {
  private client = new Redis();

  constructor(
    @inject('TypeUsersRepository')
    private typeUsersRepository: TypeUsersRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  async execute(): Promise<void> {
    const typeUsers = await this.typeUsersRepository.find();

    for (const typeUser of typeUsers) {
      let role = Role.OPERATOR;
      let permissions;

      if (typeUser.ownerId === typeUser.id) role = Role.OWNER;
      if (typeUser.isOperator) role = Role.OPERATOR;
      if (!typeUser.isOperator && typeUser.id !== typeUser.ownerId)
        role = Role.MANAGER;

      if (role === Role.OPERATOR) {
        permissions = {
          addRemoteCredit: typeUser.roles.includes('ROLE_REMOTE_CREDIT'),
          toggleMaintenanceMode: typeUser.roles.includes('ROLE_TEST_MODE'),
          editMachines: typeUser.roles.includes('ROLE_UPDATE_MACHINE'),
          deleteMachines: typeUser.roles.includes('ROLE_DELETE_MACHINE'),
          editCollections: typeUser.roles.includes('ROLE_UPDATE_COLLECT'),
          deleteCollections: typeUser.roles.includes('ROLE_DELETE_COLLECT'),
          fixMachineStock: false,
          createCategories: false,
          createGroups: false,
          createMachines: false,
          createManagers: false,
          createOperators: false,
          createPointsOfSale: false,
          createProducts: false,
          createRoutes: false,
          deleteCategories: false,
          deleteGroups: false,
          deletePointsOfSale: false,
          deleteProducts: false,
          deleteRoutes: false,
          editCategories: false,
          editGroups: false,
          editPointsOfSale: false,
          editProducts: false,
          editRoutes: false,
          generateReports: false,
          listManagers: false,
          listOperators: false,
        };
      }

      if (role === Role.MANAGER) {
        if (typeUser.roles.includes('ROLE_CREATE_COLLABORATOR')) {
          permissions = {
            addRemoteCredit: true,
            toggleMaintenanceMode: true,
            generateReports: true,
            // GROUPS
            createGroups: true,
            editGroups: true,
            deleteGroups: true,
            // ROUTES
            createRoutes: true,
            editRoutes: true,
            deleteRoutes: true,
            // POINTS OF SALES
            createPointsOfSale: true,
            editPointsOfSale: true,
            deletePointsOfSale: true,
            // PRODUCTS
            createProducts: true,
            editProducts: true,
            deleteProducts: true,
            // CATEGORIES
            createCategories: true,
            editCategories: true,
            deleteCategories: true,
            // MACHINES
            createMachines: true,
            editMachines: true,
            deleteMachines: true,
            fixMachineStock: true,
            // MANAGERS
            createManagers: true,
            listManagers: true,
            // OPERATORS
            createOperators: true,
            listOperators: true,
            deleteCollections: true,
            editCollections: true,
          };
        } else {
          permissions = {
            addRemoteCredit:
              typeUser.roles.includes('ROLE_REMOTE_CREDIT') ||
              typeUser.roles.includes('ROLE_CREATE_OPERATOR'),
            toggleMaintenanceMode:
              typeUser.roles.includes('ROLE_TEST_MODE') ||
              typeUser.roles.includes('ROLE_CREATE_OPERATOR'),
            generateReports: typeUser.roles.includes('ROLE_READ_REPORT'),
            // GROUPS
            createGroups: typeUser.roles.includes('ROLE_CREATE_COMPANY'),
            editGroups: typeUser.roles.includes('ROLE_UPDATE_COMPANY'),
            deleteGroups: typeUser.roles.includes('ROLE_DELETE_COMPANY'),
            // ROUTES
            createRoutes: typeUser.roles.includes('ROLE_CREATE_ROUTE'),
            editRoutes: typeUser.roles.includes('ROLE_UPDATE_ROUTE'),
            deleteRoutes: typeUser.roles.includes('ROLE_DELETE_ROUTE'),
            // POINTS OF SALES
            createPointsOfSale: typeUser.roles.includes(
              'ROLE_CREATE_SELLINGPOINT',
            ),
            editPointsOfSale: typeUser.roles.includes(
              'ROLE_UPDATE_SELLINGPOINT',
            ),
            deletePointsOfSale: typeUser.roles.includes(
              'ROLE_DELETE_SELLINGPOINT',
            ),
            // PRODUCTS
            createProducts: typeUser.roles.includes('ROLE_CREATE_PRODUCT'),
            editProducts: typeUser.roles.includes('ROLE_UPDATE_PRODUCT'),
            deleteProducts: typeUser.roles.includes('ROLE_DELETE_PRODUCT'),
            // CATEGORIES
            createCategories: typeUser.roles.includes(
              'ROLE_CREATE_MACHINE_CATEGORY',
            ),
            editCategories: typeUser.roles.includes(
              'ROLE_UPDATE_MACHINE_CATEGORY',
            ),
            deleteCategories: typeUser.roles.includes(
              'ROLE_DELETE_MACHINE_CATEGORY',
            ),
            // MACHINES
            createMachines: typeUser.roles.includes('ROLE_CREATE_MACHINE'),
            editMachines:
              typeUser.roles.includes('ROLE_UPDATE_MACHINE') ||
              typeUser.roles.includes('ROLE_CREATE_OPERATOR'),
            deleteMachines: typeUser.roles.includes('ROLE_DELETE_MACHINE'),
            fixMachineStock: false,

            // MANAGERS
            createManagers: false,
            listManagers: typeUser.roles.includes('ROLE_READ_COLLABORATOR'),
            // OPERATORS
            createOperators: typeUser.roles.includes('ROLE_CREATE_OPERATOR'),
            listOperators: typeUser.roles.includes('ROLE_READ_OPERATOR'),

            deleteCollections: false,
            editCollections: false,
          };
        }
      }

      const user = this.usersRepository.create({
        email: typeUser.email,
        name: typeUser.name,
        password: typeUser.password,
        isActive: typeUser.isActive === 1,
        photo: undefined,
        phoneNumber: undefined,
        permissions,
        role,
        ownerId: role !== Role.OWNER ? typeUser.ownerId.toString() : undefined,
        groupIds:
          role !== Role.OWNER
            ? typeUser.companies?.map(company => company.id.toString())
            : undefined,
      });

      await this.client.set(`@users:${typeUser.id}`, user.id);
    }

    await this.ormProvider.commit();
    this.ormProvider.clear();
  }

  async setGroupIds(): Promise<void> {
    const users = await this.usersRepository.find({ filters: {} });

    for (const user of users) {
      if (user.role !== Role.OWNER) {
        const newGroupIds: string[] = [];
        if (!user.groupIds) throw AppError.groupNotFound;
        for (const groupId of user.groupIds) {
          newGroupIds.push(
            (await this.client.get(`@groups:${groupId}`)) as string,
          );
        }

        user.groupIds = newGroupIds;
        this.usersRepository.save(user);
      }
    }

    await this.ormProvider.commit();
    this.ormProvider.clear();
  }

  async setOwnerId(): Promise<void> {
    this.ormProvider.clear();

    const users = await this.usersRepository.find({
      filters: {},
    });

    for (const user of users) {
      if (user.role !== Role.OWNER) {
        const ownerId = (await this.client.get(
          `@users:${user.ownerId}`,
        )) as string;
        user.ownerId = ownerId;

        this.usersRepository.save(user);
      }
    }

    await this.ormProvider.commit();
    this.ormProvider.clear();
  }
}

export default UsersScript;

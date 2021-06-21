"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const role_1 = __importDefault(require("../../../../modules/users/contracts/enums/role"));
const hash_provider_1 = __importDefault(require("../../../../providers/hash-provider/contracts/models/hash-provider"));
const tsyringe_1 = require("tsyringe");
const users_repository_1 = __importDefault(require("../../../../modules/users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const ioredis_1 = __importDefault(require("ioredis"));
const groups_repository_1 = __importDefault(require("../../../../modules/groups/contracts/repositories/groups.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const type_users_repository_1 = __importDefault(require("../typeorm/repostories/type-users-repository"));
let UsersScript = class UsersScript {
    constructor(typeUsersRepository, usersRepository, groupsRepository, ormProvider, hashProvider) {
        this.typeUsersRepository = typeUsersRepository;
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.ormProvider = ormProvider;
        this.hashProvider = hashProvider;
        this.client = new ioredis_1.default();
    }
    async execute() {
        const typeUsers = await this.typeUsersRepository.find();
        for (const typeUser of typeUsers) {
            let role = role_1.default.OPERATOR;
            let permissions;
            if (typeUser.ownerId === typeUser.id)
                role = role_1.default.OWNER;
            if (typeUser.isOperator)
                role = role_1.default.OPERATOR;
            if (!typeUser.isOperator && typeUser.id !== typeUser.ownerId)
                role = role_1.default.MANAGER;
            if (role === role_1.default.OPERATOR) {
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
            if (role === role_1.default.MANAGER) {
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
                }
                else {
                    permissions = {
                        addRemoteCredit: typeUser.roles.includes('ROLE_REMOTE_CREDIT') ||
                            typeUser.roles.includes('ROLE_CREATE_OPERATOR'),
                        toggleMaintenanceMode: typeUser.roles.includes('ROLE_TEST_MODE') ||
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
                        createPointsOfSale: typeUser.roles.includes('ROLE_CREATE_SELLINGPOINT'),
                        editPointsOfSale: typeUser.roles.includes('ROLE_UPDATE_SELLINGPOINT'),
                        deletePointsOfSale: typeUser.roles.includes('ROLE_DELETE_SELLINGPOINT'),
                        // PRODUCTS
                        createProducts: typeUser.roles.includes('ROLE_CREATE_PRODUCT'),
                        editProducts: typeUser.roles.includes('ROLE_UPDATE_PRODUCT'),
                        deleteProducts: typeUser.roles.includes('ROLE_DELETE_PRODUCT'),
                        // CATEGORIES
                        createCategories: typeUser.roles.includes('ROLE_CREATE_MACHINE_CATEGORY'),
                        editCategories: typeUser.roles.includes('ROLE_UPDATE_MACHINE_CATEGORY'),
                        deleteCategories: typeUser.roles.includes('ROLE_DELETE_MACHINE_CATEGORY'),
                        // MACHINES
                        createMachines: typeUser.roles.includes('ROLE_CREATE_MACHINE'),
                        editMachines: typeUser.roles.includes('ROLE_UPDATE_MACHINE') ||
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
                password: typeUser.password.replace('$2y', '$2b'),
                isActive: typeUser.isActive === 1,
                photo: undefined,
                phoneNumber: undefined,
                permissions,
                role,
                ownerId: role !== role_1.default.OWNER ? typeUser.ownerId.toString() : undefined,
                groupIds: role !== role_1.default.OWNER
                    ? typeUser.companies?.map(company => company.id.toString())
                    : undefined,
            });
            await this.client.set(`@users:${typeUser.id}`, user.id);
        }
        await this.ormProvider.commit();
        this.ormProvider.clear();
    }
    async setGroupIds() {
        const users = await this.usersRepository.find({ filters: {} });
        for (const user of users) {
            if (user.role !== role_1.default.OWNER) {
                const newGroupIds = [];
                if (!user.groupIds)
                    throw app_error_1.default.groupNotFound;
                for (const groupId of user.groupIds) {
                    newGroupIds.push((await this.client.get(`@groups:${groupId}`)));
                }
                user.groupIds = newGroupIds;
                this.usersRepository.save(user);
            }
        }
        await this.ormProvider.commit();
        this.ormProvider.clear();
    }
    async setOwnerId() {
        this.ormProvider.clear();
        const users = await this.usersRepository.find({
            filters: {},
        });
        for (const user of users) {
            if (user.role !== role_1.default.OWNER) {
                const ownerId = (await this.client.get(`@users:${user.ownerId}`));
                user.ownerId = ownerId;
                this.usersRepository.save(user);
            }
        }
        await this.ormProvider.commit();
        this.ormProvider.clear();
    }
};
UsersScript = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TypeUsersRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __param(4, tsyringe_1.inject('HashProvider')),
    __metadata("design:paramtypes", [type_users_repository_1.default, Object, Object, Object, Object])
], UsersScript);
exports.default = UsersScript;

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
const tsyringe_1 = require("tsyringe");
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const ioredis_1 = __importDefault(require("ioredis"));
const machines_repository_1 = __importDefault(require("../../../../modules/machines/contracts/repositories/machines.repository"));
const groups_repository_1 = __importDefault(require("../../../../modules/groups/contracts/repositories/groups.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const box_1 = __importDefault(require("../../../../modules/machines/contracts/models/box"));
const counter_1 = __importDefault(require("../../../../modules/machines/contracts/models/counter"));
const couter_types_repository_1 = __importDefault(require("../../../../modules/counter-types/contracts/repositories/couter-types.repository"));
const users_repository_1 = __importDefault(require("../../../../modules/users/contracts/repositories/users.repository"));
const role_1 = __importDefault(require("../../../../modules/users/contracts/enums/role"));
const categories_repository_1 = __importDefault(require("../../../../modules/categories/contracts/repositories/categories.repository"));
const logger_1 = __importDefault(require("../../../../config/logger"));
const type_1 = __importDefault(require("../../../../modules/counter-types/contracts/enums/type"));
const type_machines_repository_1 = __importDefault(require("../typeorm/repositories/type-machines.repository"));
let MachinesScript = class MachinesScript {
    constructor(typeMachinesRepository, machinesRepository, groupsRepository, counterTypesRepository, usersRepository, categoriesRepository, ormProvider) {
        this.typeMachinesRepository = typeMachinesRepository;
        this.machinesRepository = machinesRepository;
        this.groupsRepository = groupsRepository;
        this.counterTypesRepository = counterTypesRepository;
        this.usersRepository = usersRepository;
        this.categoriesRepository = categoriesRepository;
        this.ormProvider = ormProvider;
        this.client = new ioredis_1.default();
    }
    async execute() {
        this.ormProvider.clear();
        const machines = await this.typeMachinesRepository.find();
        try {
            for (const typeMachine of machines) {
                const operatorId = (await this.client.get(`@users:${typeMachine.operatorId}`));
                const groupId = (await this.client.get(`@groups:${typeMachine.companyId}`));
                const group = await this.groupsRepository.findOne({
                    by: 'id',
                    value: groupId,
                });
                if (!group)
                    throw app_error_1.default.groupNotFound;
                const ownerId = group?.ownerId;
                const boxesIds = [
                    ...new Set(typeMachine.counters?.map(counter => counter.counterGroupId)),
                ];
                const countersTypes = await this.counterTypesRepository.find({
                    ownerId,
                });
                const boxes = boxesIds.map(boxeId => {
                    const typeCounters = typeMachine.counters.filter(counter => counter.counterGroupId === boxeId);
                    const counters = typeCounters.map(typeCounter => {
                        let counterType;
                        if (typeCounter.name.toLowerCase().includes('prize') ||
                            typeCounter.name.toLowerCase().includes('premio') ||
                            typeCounter.name.toLowerCase().includes('prê') ||
                            typeCounter.name.toLowerCase().includes('bolinha') ||
                            typeCounter.name.toLowerCase().includes('saida') ||
                            typeCounter.name.toLowerCase().includes('saída') ||
                            typeCounter.name.toLowerCase().includes('pelu') ||
                            typeCounter.name.toLowerCase().includes('pelú') ||
                            typeCounter.name.toLowerCase().includes('bala') ||
                            typeCounter.name.toLowerCase().includes('porta a') ||
                            typeCounter.name.toLowerCase().includes('porta b') ||
                            typeCounter.name.toLowerCase().includes('tomacat'))
                            counterType = countersTypes.find(item => item.label === 'Prêmio');
                        if (typeCounter.name.toLowerCase().includes('notei') ||
                            typeCounter.name.toLowerCase().includes('dinhei') ||
                            typeCounter.name.toLowerCase().includes('cré') ||
                            typeCounter.name.toLowerCase().includes('cre') ||
                            typeCounter.name.toLowerCase().includes('entrada') ||
                            typeCounter.name.toLowerCase().includes('coin') ||
                            typeCounter.name.toLowerCase().includes('box') ||
                            typeCounter.name.toLowerCase().includes('0') ||
                            typeCounter.name.toLowerCase().includes('haste'))
                            counterType = countersTypes.find(item => item.label === 'Noteiro');
                        if (typeCounter.name.toLowerCase().includes('remoto'))
                            counterType = countersTypes.find(item => item.label === 'Crédito Remoto');
                        if (typeCounter.name.toLowerCase().includes('cart'))
                            counterType = countersTypes.find(item => item.label === 'Cartão');
                        if (typeCounter.name.toLowerCase().includes('fiche') ||
                            typeCounter.name.toLowerCase().includes('ficha'))
                            counterType = countersTypes.find(item => item.label === 'Ficheiro');
                        if (typeCounter.name.toLowerCase().includes('moedei'))
                            counterType = countersTypes.find(item => item.label === 'Moedeiro');
                        if (!counterType) {
                            logger_1.default.info(ownerId);
                            logger_1.default.info(countersTypes);
                            logger_1.default.info(typeCounter.name);
                            throw app_error_1.default.counterTypeNotFound;
                        }
                        const counter = new counter_1.default({
                            counterTypeId: counterType.id,
                            hasDigital: typeCounter.hasDigital === 1,
                            hasMechanical: typeCounter.hasMechanical === 1,
                            pin: typeCounter.pin
                                ? `Pino ${typeCounter.pin?.toString()}`
                                : undefined,
                        });
                        this.client.set(`@boxes:@machineId:${typeMachine.id}:@counterId:${typeCounter.id}`, boxeId);
                        this.client.set(`@counters:@machineId:${typeMachine.id}:@counterId:${typeCounter.id}`, counter.id);
                        return counter;
                    });
                    const box = new box_1.default({
                        counters,
                    });
                    this.client.set(`@boxes:${boxeId}`, box.id);
                    return box;
                });
                const telemetryBoardId = await this.client.get(`@telemetryBoards:${typeMachine.telemetryId}`);
                const categoryId = (await this.client.get(`@categories:${typeMachine.machineCategoryId}`));
                const category = await this.categoriesRepository.findOne({
                    by: 'id',
                    value: categoryId,
                });
                const machine = this.machinesRepository.create({
                    gameValue: Number(typeMachine.gameValue),
                    isActive: typeMachine.active === 1,
                    serialNumber: typeMachine.serialNumber,
                    operatorId,
                    ownerId,
                    groupId,
                    locationId: undefined,
                    telemetryBoardId: telemetryBoardId
                        ? Number(telemetryBoardId)
                        : undefined,
                    categoryId,
                    categoryLabel: category?.label ? category.label : '',
                    boxes,
                    lastCollection: typeMachine.lastCollection,
                });
                await this.client.set(`@machines:${typeMachine.id}`, `${machine.id}`);
                await this.ormProvider.commit();
            }
        }
        catch (error) {
            logger_1.default.info(error);
        }
    }
    async createCountersTypes() {
        this.ormProvider.clear();
        const users = await this.usersRepository.find({
            filters: {
                role: role_1.default.OWNER,
            },
        });
        users.forEach(user => {
            this.counterTypesRepository.create({
                label: 'Moedeiro',
                type: type_1.default.IN,
                ownerId: user.id,
            });
            this.counterTypesRepository.create({
                label: 'Noteiro',
                type: type_1.default.IN,
                ownerId: user.id,
            });
            this.counterTypesRepository.create({
                label: 'Cartão',
                type: type_1.default.IN,
                ownerId: user.id,
            });
            this.counterTypesRepository.create({
                label: 'Crédito Remoto',
                type: type_1.default.IN,
                ownerId: user.id,
            });
            this.counterTypesRepository.create({
                label: 'Prêmio',
                type: type_1.default.OUT,
                ownerId: user.id,
            });
            this.counterTypesRepository.create({
                label: 'Ficheiro',
                type: type_1.default.IN,
                ownerId: user.id,
            });
        });
        await this.ormProvider.commit();
    }
};
MachinesScript = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TypeMachinesRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('CounterTypesRepository')),
    __param(4, tsyringe_1.inject('UsersRepository')),
    __param(5, tsyringe_1.inject('CategoriesRepository')),
    __param(6, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [type_machines_repository_1.default, Object, Object, Object, Object, Object, Object])
], MachinesScript);
exports.default = MachinesScript;

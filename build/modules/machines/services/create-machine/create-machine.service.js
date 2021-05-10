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
const categories_repository_1 = __importDefault(require("../../../categories/contracts/repositories/categories.repository"));
const box_1 = __importDefault(require("../../contracts/models/box"));
const counter_1 = __importDefault(require("../../contracts/models/counter"));
const machine_1 = __importDefault(require("../../contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../contracts/repositories/machines.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const couter_types_repository_1 = __importDefault(require("../../../counter-types/contracts/repositories/couter-types.repository"));
const telemetry_boards_repository_1 = __importDefault(require("../../../telemetry/contracts/repositories/telemetry-boards.repository"));
let CreateMachineService = class CreateMachineService {
    constructor(machinesRepository, usersRepository, ormProvider, categoriesRepository, pointsOfSaleRepository, counterTypesRepository, groupsRepository, telemetryBoardsRepository) {
        this.machinesRepository = machinesRepository;
        this.usersRepository = usersRepository;
        this.ormProvider = ormProvider;
        this.categoriesRepository = categoriesRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.counterTypesRepository = counterTypesRepository;
        this.groupsRepository = groupsRepository;
        this.telemetryBoardsRepository = telemetryBoardsRepository;
    }
    async execute({ userId, categoryId, boxes, gameValue, groupId, locationId, operatorId, serialNumber, telemetryBoardId, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && user.role !== role_1.default.MANAGER)
            throw app_error_1.default.authorizationError;
        const checkMachineExists = await this.machinesRepository.findOne({
            by: 'serialNumber',
            value: serialNumber,
        });
        if (checkMachineExists)
            throw app_error_1.default.serialNumberAlreadyUsed;
        if (user.role === role_1.default.MANAGER) {
            if (!user.permissions?.createMachines)
                throw app_error_1.default.authorizationError;
            if (!user.groupIds?.includes(groupId))
                throw app_error_1.default.authorizationError;
        }
        if (user.role === role_1.default.OWNER) {
            const groups = await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
            });
            const groupIds = groups.map(group => group.id);
            if (!groupIds.includes(groupId))
                throw app_error_1.default.authorizationError;
        }
        const ownerId = user.role === role_1.default.OWNER ? user.id : user.ownerId;
        if (!ownerId)
            throw app_error_1.default.unknownError;
        const boxesEntities = boxes.map(box => {
            const counters = box.counters.map(counter => new counter_1.default(counter));
            return new box_1.default({ counters });
        });
        const counterTypeIds = [
            ...new Set(boxesEntities.flatMap(boxe => boxe.counters.map(counter => counter.counterTypeId))),
        ];
        const counterTypes = await this.counterTypesRepository.find({
            id: counterTypeIds,
        });
        if (counterTypeIds.length !== counterTypes.length)
            throw app_error_1.default.authorizationError;
        const category = await this.categoriesRepository.findOne({
            by: 'id',
            value: categoryId,
        });
        if (!category)
            throw app_error_1.default.machineCategoryNotFound;
        if (locationId) {
            const pointOfSale = await this.pointsOfSaleRepository.findOne({
                by: 'id',
                value: locationId,
            });
            if (pointOfSale?.groupId !== groupId)
                throw app_error_1.default.authorizationError;
        }
        if (operatorId) {
            const operator = await this.usersRepository.findOne({
                by: 'id',
                value: operatorId,
            });
            if (!operator?.groupIds?.includes(groupId))
                throw app_error_1.default.authorizationError;
        }
        const machine = this.machinesRepository.create({
            boxes: boxesEntities,
            categoryId: category.id,
            gameValue,
            groupId,
            locationId,
            operatorId,
            ownerId,
            serialNumber,
            categoryLabel: category.label,
            isActive: true,
            telemetryBoardId,
        });
        if (telemetryBoardId) {
            const telemetryBoard = await this.telemetryBoardsRepository.findById(telemetryBoardId);
            if (!telemetryBoard)
                throw app_error_1.default.telemetryBoardNotFound;
            if (user.role === role_1.default.MANAGER &&
                !user.groupIds?.includes(telemetryBoard.groupId))
                throw app_error_1.default.authorizationError;
            if (user.role === role_1.default.OWNER && telemetryBoard.ownerId !== user.id)
                throw app_error_1.default.authorizationError;
            telemetryBoard.machineId = machine.id;
            this.telemetryBoardsRepository.save(telemetryBoard);
        }
        await this.ormProvider.commit();
        return machine;
    }
};
CreateMachineService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('MachinesRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('OrmProvider')),
    __param(3, tsyringe_1.inject('CategoriesRepository')),
    __param(4, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(5, tsyringe_1.inject('CounterTypesRepository')),
    __param(6, tsyringe_1.inject('GroupsRepository')),
    __param(7, tsyringe_1.inject('TelemetryBoardsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], CreateMachineService);
exports.default = CreateMachineService;

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
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const find_machines_dto_1 = __importDefault(require("../../contracts/dtos/find-machines.dto"));
const machine_1 = __importDefault(require("../../contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../contracts/repositories/machines.repository"));
const routes_repository_1 = __importDefault(require("../../../routes/contracts/repositories/routes.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
const bluebird_1 = require("bluebird");
let ListMachinesService = class ListMachinesService {
    constructor(machinesRepository, usersRepository, groupsRepository, routesRepository, telemetryLogsRepository) {
        this.machinesRepository = machinesRepository;
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.routesRepository = routesRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
    }
    async execute({ lean, userId, categoryId, groupId, routeId, pointOfSaleId, serialNumber, telemetryStatus, isActive, operatorId, limit, offset, }) {
        const filters = {};
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role === role_1.default.OWNER)
            filters.ownerId = user.id;
        if (user.role === role_1.default.MANAGER)
            filters.groupIds = user.groupIds;
        if (user.role === role_1.default.OPERATOR)
            filters.operatorId = user.id;
        if (telemetryStatus)
            filters.telemetryStatus = telemetryStatus;
        if (lean) {
            filters.isActive = true;
            filters.fields = ['id', 'serialNumber', 'locationId'];
            const leanMachines = await this.machinesRepository.find(filters);
            return leanMachines;
        }
        if (routeId) {
            filters.routeId = routeId;
            const route = await this.routesRepository.findOne({
                id: routeId,
            });
            if (!route) {
                return {
                    machines: [],
                    count: 0,
                };
            }
            filters.pointOfSaleId = route.pointsOfSaleIds;
        }
        if (groupId) {
            if (!user.groupIds?.includes(groupId) && user.role !== role_1.default.OWNER)
                throw app_error_1.default.authorizationError;
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: groupId,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            if (user.role === role_1.default.OWNER && user.id !== group.ownerId)
                throw app_error_1.default.authorizationError;
            filters.groupIds = [groupId];
        }
        if (pointOfSaleId && !routeId)
            filters.pointOfSaleId = pointOfSaleId;
        filters.categoryId = categoryId;
        filters.serialNumber = serialNumber;
        filters.limit = limit;
        filters.offset = offset;
        filters.isActive = isActive;
        if (user.role !== role_1.default.OPERATOR)
            filters.operatorId = operatorId;
        filters.populate = ['operator'];
        const result = await this.machinesRepository.find(filters);
        const machinesPromise = result.machines.map(async (machine) => {
            const [givenPrizes,] = await this.telemetryLogsRepository.getPrizesPerMachine({
                endDate: new Date(),
                startDate: machine.lastCollection,
                groupIds: [machine.groupId],
                machineId: machine.id,
            });
            if (givenPrizes) {
                machine.givenPrizes = givenPrizes.prizes;
            }
            else {
                machine.givenPrizes = 0;
            }
            machine.operator = {
                name: machine.operator?.name,
            };
            return machine;
        });
        const machines = await bluebird_1.Promise.all(machinesPromise);
        result.machines = machines;
        return result;
    }
};
ListMachinesService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('MachinesRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('RoutesRepository')),
    __param(4, tsyringe_1.inject('TelemetryLogsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ListMachinesService);
exports.default = ListMachinesService;

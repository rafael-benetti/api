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
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const tsyringe_1 = require("tsyringe");
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const group_1 = __importDefault(require("../../../groups/contracts/models/group"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const logger_1 = __importDefault(require("../../../../config/logger"));
let GenerateMachinesReportService = class GenerateMachinesReportService {
    constructor(usersRepository, pointsOfSaleRepository, groupsRepository, machinesRepository, telemetryLogsRepository) {
        this.usersRepository = usersRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.groupsRepository = groupsRepository;
        this.machinesRepository = machinesRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
    }
    async execute({ userId, groupId, startDate, endDate, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.MANAGER && user.role !== role_1.default.OWNER)
            throw app_error_1.default.authorizationError;
        let groupIds = [];
        let groups = [];
        if (groupId) {
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: groupId,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            if (user.role === role_1.default.OWNER && group.ownerId !== user.id)
                throw app_error_1.default.authorizationError;
            if (user.role === role_1.default.MANAGER && !user.groupIds?.includes(group.id))
                throw app_error_1.default.authorizationError;
            groups = [group];
            groupIds.push(groupId);
        }
        else if (user.role === role_1.default.MANAGER) {
            if (!user.groupIds)
                throw app_error_1.default.unknownError;
            groupIds = user.groupIds;
            groups = await this.groupsRepository.find({
                filters: {
                    ids: user.groupIds,
                },
            });
        }
        else if (user.role === role_1.default.OWNER) {
            groups = await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
                fields: ['id', 'label'],
            });
            groupIds = groups.map(group => group.id);
        }
        const machines = await this.machinesRepository.find({
            groupIds,
            fields: ['pointOfSale'],
        });
        const incomePerMachine = await this.telemetryLogsRepository.getIncomePerMachine({ groupIds, endDate, startDate });
        return incomePerMachine;
    }
};
GenerateMachinesReportService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('MachinesRepository')),
    __param(4, tsyringe_1.inject('TelemetryLogsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GenerateMachinesReportService);
exports.default = GenerateMachinesReportService;

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
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const telemetry_log_1 = __importDefault(require("../../contracts/entities/telemetry-log"));
const telemetry_logs_repository_1 = __importDefault(require("../../contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let ListTelemetryLogsService = class ListTelemetryLogsService {
    constructor(telemetryLogsRepository, machinesRepository, usersRepository) {
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.machinesRepository = machinesRepository;
        this.usersRepository = usersRepository;
    }
    async execute({ userId, machineId, type, startDate, endDate, limit, offset, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const machine = await this.machinesRepository.findOne({
            by: 'id',
            value: machineId,
        });
        if (!machine)
            throw app_error_1.default.machineNotFound;
        if (user.role === role_1.default.OPERATOR && machine.operatorId !== user.id)
            throw app_error_1.default.authorizationError;
        else if (user.role === role_1.default.OWNER && machine.ownerId !== user.id)
            throw app_error_1.default.authorizationError;
        else if (user.role === role_1.default.MANAGER &&
            !user.groupIds?.includes(machine.groupId))
            throw app_error_1.default.authorizationError;
        const { telemetryLogs, count, } = await this.telemetryLogsRepository.findAndCount({
            filters: {
                machineId,
                type,
                date: {
                    startDate,
                    endDate,
                },
            },
            limit,
            offset,
        });
        return { telemetryLogs, count };
    }
};
ListTelemetryLogsService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('UsersRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ListTelemetryLogsService);
exports.default = ListTelemetryLogsService;

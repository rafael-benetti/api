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
const create_telemetry_log_dto_1 = __importDefault(require("../../../contracts/dtos/create-telemetry-log.dto"));
const find_telemetry_logs_dto_1 = __importDefault(require("../../../contracts/dtos/find-telemetry-logs.dto"));
const telemetry_log_1 = __importDefault(require("../../../contracts/entities/telemetry-log"));
const telemetry_logs_repository_1 = __importDefault(require("../../../contracts/repositories/telemetry-logs.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const mikro_telemetry_log_1 = __importDefault(require("../entities/mikro-telemetry-log"));
const telemetry_log_mapper_1 = __importDefault(require("../mappers/telemetry-log-mapper"));
let MikroTelemetryLogsRepository = class MikroTelemetryLogsRepository {
    constructor(ormProvider) {
        this.ormProvider = ormProvider;
        this.repository = this.ormProvider.entityManager.getRepository(mikro_telemetry_log_1.default);
    }
    create(data) {
        const telemetryLog = new mikro_telemetry_log_1.default(data);
        this.repository.persist(telemetryLog);
        return telemetry_log_mapper_1.default.toApi(telemetryLog);
    }
    async find(data) {
        const query = {};
        const { groupId, pointOfSaleId, machineId, date, maintenance, type, } = data.filters;
        if (groupId)
            query.groupId = groupId;
        if (machineId)
            query.machineId = machineId;
        if (date)
            if (!date.startDate) {
                query.date = {
                    $lte: date.endDate,
                };
            }
            else {
                query.date = {
                    $gte: date.startDate,
                    $lte: date.endDate,
                };
            }
        if (maintenance !== undefined)
            query.maintenance = maintenance;
        if (pointOfSaleId !== undefined)
            query.pointOfSaleId = pointOfSaleId;
        if (type)
            query.type = type;
        const telemetryLogs = await this.repository.find({ ...query }, { orderBy: { date: 'DESC' }, limit: data.limit, offset: data.offset });
        return telemetryLogs;
    }
};
MikroTelemetryLogsRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [mikro_orm_provider_1.default])
], MikroTelemetryLogsRepository);
exports.default = MikroTelemetryLogsRepository;

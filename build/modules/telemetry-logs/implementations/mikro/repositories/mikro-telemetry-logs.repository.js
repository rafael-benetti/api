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
const get_income_per_machine_response_dto_1 = __importDefault(require("../../../contracts/dtos/get-income-per-machine-response.dto"));
const get_income_per_machine_dto_1 = __importDefault(require("../../../contracts/dtos/get-income-per-machine.dto"));
const get_income_per_point_of_sale_dto_1 = __importDefault(require("../../../contracts/dtos/get-income-per-point-of-sale.dto"));
const get_prizes_per_machine_repository_dto_1 = __importDefault(require("../../../contracts/dtos/get-prizes-per-machine-repository.dto"));
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
        if (date?.startDate)
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
        const [telemetryLogs, count] = await this.repository.findAndCount({ ...query }, {
            orderBy: { date: 'DESC' },
            limit: data.limit,
            offset: data.offset,
        });
        return {
            telemetryLogs: telemetryLogs.map(telemetryLog => telemetry_log_mapper_1.default.toApi(telemetryLog)),
            count,
        };
    }
    async getIncomePerMachine({ groupIds, startDate, endDate, }) {
        const incomePerMachine = await this.repository.aggregate([
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                    type: 'IN',
                },
            },
            {
                $group: {
                    _id: '$machineId',
                    income: {
                        $sum: '$value',
                    },
                    numberOfPlays: {
                        $sum: '$numberOfPlays',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    income: 1,
                    count: 1,
                    numberOfPlays: 1,
                    type: 1,
                },
            },
        ]);
        return incomePerMachine;
    }
    async getPrizesPerMachine({ groupIds, startDate, endDate, }) {
        const prizesPerMachine = await this.repository.aggregate([
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                    type: 'OUT',
                },
            },
            {
                $group: {
                    _id: '$machineId',
                    prizes: {
                        $sum: '$value',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    prizes: 1,
                    count: 1,
                    type: 1,
                },
            },
        ]);
        return prizesPerMachine;
    }
    async getIncomePerGroup({ groupIds, startDate, endDate, }) {
        const incomePerGroup = await this.repository.aggregate([
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                    type: 'IN',
                },
            },
            {
                $group: {
                    _id: '$groupId',
                    income: {
                        $sum: '$value',
                    },
                    numberOfPlays: {
                        $sum: '$numberOfPlays',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    income: 1,
                    count: 1,
                    numberOfPlays: 1,
                    type: 1,
                },
            },
        ]);
        return incomePerGroup;
    }
    async incomePerPointOfSale({ groupIds, startDate, endDate, }) {
        const pointsOfSale = await this.repository.aggregate([
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                    type: 'IN',
                },
            },
            {
                $group: {
                    _id: '$pointOfSaleId',
                    income: {
                        $sum: '$value',
                    },
                    numberOfPlays: {
                        $sum: '$numberOfPlays',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    income: 1,
                    count: 1,
                    numberOfPlays: 1,
                    type: 1,
                },
            },
        ]);
        return pointsOfSale;
    }
};
MikroTelemetryLogsRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [mikro_orm_provider_1.default])
], MikroTelemetryLogsRepository);
exports.default = MikroTelemetryLogsRepository;

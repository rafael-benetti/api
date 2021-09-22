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
const get_group_income_per_period_dto_1 = __importDefault(require("../../../contracts/dtos/get-group-income-per-period.dto"));
const get_income_per_counter_type_dto_1 = __importDefault(require("../../../contracts/dtos/get-income-per-counter-type.dto"));
const get_income_per_machine_response_dto_1 = __importDefault(require("../../../contracts/dtos/get-income-per-machine-response.dto"));
const get_income_per_machine_dto_1 = __importDefault(require("../../../contracts/dtos/get-income-per-machine.dto"));
const get_income_per_point_of_sale_dto_1 = __importDefault(require("../../../contracts/dtos/get-income-per-point-of-sale.dto"));
const get_machine_income_per_day_1 = __importDefault(require("../../../contracts/dtos/get-machine-income-per-day"));
const get_point_of_sale_income_per_date_dto_1 = __importDefault(require("../../../contracts/dtos/get-point-of-sale-income-per-date.dto"));
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
    async findAndCount(data) {
        const query = {};
        const { groupId, pointOfSaleId, machineId, date, maintenance, type } = data.filters;
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
    async find(data) {
        const query = {};
        const { groupId, pointOfSaleId, machineId, date, maintenance, routeId, type, } = data.filters;
        if (groupId)
            query.groupId = groupId;
        if (machineId)
            query.machineId = machineId;
        if (routeId)
            query.routeId = routeId;
        if (date?.startDate || date?.endDate)
            if (date.startDate && !date.endDate) {
                query.date = {
                    $gte: date.startDate,
                };
            }
            else if (date.endDate && !date.startDate) {
                query.date = {
                    $lte: date.endDate,
                };
            }
            else if (date.endDate && date.startDate) {
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
        const telemetryLogs = await this.repository.find({ ...query }, {
            orderBy: { date: 'DESC' },
            limit: data.limit,
            offset: data.offset,
        });
        return telemetryLogs;
    }
    async getIncomePerMachine({ groupIds, startDate, endDate, }) {
        const incomePerMachine = await this.repository.aggregate([
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    maintenance: false,
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
    async getIncomeAndPrizesPerMachine({ pointOfSaleId, startDate, endDate, }) {
        const incomePerMachine = await this.repository.aggregate([
            {
                $match: {
                    pointOfSaleId,
                    maintenance: false,
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: '$machineId',
                    income: {
                        $sum: {
                            $cond: [{ $eq: ['$type', 'IN'] }, '$value', 0],
                        },
                    },
                    numberOfPrizes: {
                        $sum: {
                            $cond: [{ $eq: ['$type', 'OUT'] }, '$value', 0],
                        },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);
        return incomePerMachine;
    }
    async getPrizesPerMachine({ groupIds, machineId, startDate, endDate, }) {
        const stages = [
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    maintenance: false,
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
        ];
        if (machineId) {
            stages.unshift({
                $match: {
                    machineId,
                },
            });
        }
        const prizesPerMachine = await this.repository.aggregate(stages);
        return prizesPerMachine;
    }
    async getIncomePerGroup({ groupIds, startDate, endDate, }) {
        const incomePerGroup = await this.repository.aggregate([
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    maintenance: false,
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
                    maintenance: false,
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
    async getMachineIncomePerDay({ groupIds, startDate, endDate, machineId, withHours, }) {
        const response = await this.repository.aggregate([
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    machineId,
                    maintenance: false,
                    pin: {
                        $exists: true,
                        $ne: null,
                    },
                    date: {
                        $exists: true,
                        $ne: null,
                        $gte: startDate,
                        $lt: endDate,
                    },
                    type: 'IN',
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: `%Y-%m-%d${withHours ? 'T%H:00:00' : ''}`,
                            date: '$date',
                            timezone: withHours ? '+00:00' : '-03:00',
                        },
                    },
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
                    pin: 1,
                    numberOfPlays: 1,
                    type: 1,
                },
            },
        ]);
        return response;
    }
    async getMachineGivenPrizesPerDay({ groupIds, startDate, endDate, machineId, withHours, }) {
        const stages = [
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    machineId,
                    maintenance: false,
                    pin: {
                        $exists: true,
                        $ne: null,
                    },
                    type: 'OUT',
                },
            },
            {
                $group: {
                    _id: {
                        pin: '$pin',
                        date: {
                            $dateToString: {
                                format: `%Y-%m-%d${withHours ? 'T%H:00:00' : ''}`,
                                date: '$date',
                                timezone: withHours ? '+00:00' : '-03:00',
                            },
                        },
                    },
                    givenPrizes: {
                        $sum: '$value',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    date: 1,
                    count: 1,
                    pin: 1,
                    type: 1,
                    givenPrizes: 1,
                },
            },
        ];
        if (!startDate) {
            stages.unshift({
                $match: {
                    date: {
                        $lt: endDate,
                    },
                },
            });
        }
        else {
            stages.unshift({
                $match: {
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            });
        }
        const response = await this.repository.aggregate(stages);
        return response;
    }
    async getPointOfSaleIncomePerDate({ startDate, endDate, pointOfSaleId, withHours, }) {
        const response = await this.repository.aggregate([
            {
                $match: {
                    pointOfSaleId,
                    maintenance: false,
                    date: {
                        $exists: true,
                        $ne: null,
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: `%Y-%m-%d${withHours ? 'T%H:00:00' : ''}`,
                                date: '$date',
                                timezone: withHours ? '+00:00' : '-03:00',
                            },
                        },
                        type: '$type',
                        machineId: '$machineId',
                    },
                    total: {
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
                    total: 1,
                    count: 1,
                    numberOfPlays: 1,
                    type: 1,
                },
            },
        ]);
        return response;
    }
    async getGroupIncomePerPeriod({ groupIds, pointsOfSaleIds, startDate, endDate, withHours, type, }) {
        const stages = [
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    maintenance: false,
                    pin: {
                        $exists: true,
                        $ne: null,
                    },
                    date: {
                        $exists: true,
                        $ne: null,
                        $gte: startDate,
                        $lt: endDate,
                    },
                    type,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: `%Y-%m-%d${withHours ? 'T%H:00:00Z' : 'T12:00:00Z'}`,
                            date: '$date',
                            timezone: withHours ? '+00:00' : '-03:00',
                        },
                    },
                    total: {
                        $sum: '$value',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    total: 1,
                },
            },
        ];
        if (pointsOfSaleIds) {
            stages.unshift({
                $match: {
                    pointOfSaleId: {
                        $in: pointsOfSaleIds,
                    },
                },
            });
        }
        const response = await this.repository.aggregate(stages);
        return response;
    }
    async getIncomePerCounterType({ groupIds, pointsOfSaleIds, }) {
        const stages = [
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                    maintenance: false,
                    pin: {
                        $exists: true,
                        $ne: null,
                    },
                    type: 'IN',
                },
            },
            {
                $group: {
                    _id: '$counterLabel',
                    total: {
                        $sum: '$value',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    counterLabel: '$_id',
                    total: 1,
                },
            },
        ];
        if (pointsOfSaleIds) {
            stages.unshift({
                $match: {
                    pointOfSaleId: {
                        $in: pointsOfSaleIds,
                    },
                },
            });
        }
        const response = await this.repository.aggregate(stages);
        return response;
    }
    save(data) {
        const telemetryLog = telemetry_log_mapper_1.default.toOrm(data);
        this.repository.persist(telemetryLog);
    }
};
MikroTelemetryLogsRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [mikro_orm_provider_1.default])
], MikroTelemetryLogsRepository);
exports.default = MikroTelemetryLogsRepository;

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
const machine_1 = __importDefault(require("../../../machines/contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const date_fns_1 = require("date-fns");
const bluebird_1 = require("bluebird");
const tsyringe_1 = require("tsyringe");
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const routes_repository_1 = __importDefault(require("../../../routes/contracts/repositories/routes.repository"));
let DashboardInfoServiceV2 = class DashboardInfoServiceV2 {
    constructor(usersRepository, machinesRepository, groupsRepository, telemetryLogsRepository, routesRepository) {
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.groupsRepository = groupsRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.routesRepository = routesRepository;
    }
    async execute({ userId, period, startDate, endDate, groupId, routeId, pointOfSaleId, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const isOperator = user.role === role_1.default.OPERATOR;
        let groupIds = [];
        let locations;
        if (user.role === role_1.default.OWNER) {
            const ownerGroupIds = (await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
            })).map(group => group.id);
            if (groupId) {
                if (ownerGroupIds.includes(groupId))
                    groupIds = [groupId];
                else
                    throw app_error_1.default.authorizationError;
            }
            else
                groupIds = ownerGroupIds;
        }
        if (user.role === role_1.default.MANAGER) {
            if (groupId) {
                if (user.groupIds?.includes(groupId))
                    groupIds = [groupId];
                else
                    throw app_error_1.default.authorizationError;
            }
            else if (user.groupIds) {
                groupIds = user.groupIds;
            }
            else
                throw app_error_1.default.missingGroupId;
        }
        if (routeId) {
            const route = await this.routesRepository.findOne({
                id: routeId,
            });
            if (!route)
                throw app_error_1.default.routeNotFound;
            locations = route.pointsOfSaleIds;
        }
        if (pointOfSaleId)
            locations = [pointOfSaleId];
        const machinesSortedByLastCollectionPromise = this.machinesRepository.find({
            checkLocationExists: true,
            orderByLastCollection: true,
            operatorId: isOperator ? user.id : undefined,
            groupIds,
            pointOfSaleId: locations,
            limit: 5,
            offset: 0,
            fields: [
                'id',
                'serialNumber',
                'categoryLabel',
                'lastCollection',
                'lastConnection',
                'pointOfSaleId',
                'pointOfSale',
            ],
            populate: ['pointOfSale'],
        });
        const machinesSortedByLastConnectionPromise = this.machinesRepository.find({
            checkLocationExists: true,
            orderByLastConnection: true,
            pointOfSaleId: locations,
            operatorId: isOperator ? user.id : undefined,
            groupIds: isOperator ? undefined : groupIds,
            telemetryStatus: 'OFFLINE',
            limit: 5,
            offset: 0,
            fields: [
                'id',
                'serialNumber',
                'categoryLabel',
                'lastConnection',
                'lastCollection',
                'pointOfSaleId',
                'pointOfSale',
            ],
            populate: ['pointOfSale'],
        });
        const machinesSortedByStockPromise = this.machinesRepository.machineSortedByStock({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
            pointOfSaleId: locations,
        });
        const offlineMachinesPromise = this.machinesRepository.count({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
            telemetryStatus: 'OFFLINE',
            pointOfSaleId: locations,
            checkLocationExists: true,
        });
        const machinesNeverConnectedPromise = this.machinesRepository.count({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
            telemetryStatus: 'VIRGIN',
            pointOfSaleId: locations,
            checkLocationExists: true,
        });
        const onlineMachinesPromise = this.machinesRepository.count({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
            telemetryStatus: 'ONLINE',
            pointOfSaleId: locations,
            checkLocationExists: true,
        });
        const machinesWithoutTelemetryBoardPromise = this.machinesRepository.count({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
            telemetryStatus: 'NO_TELEMETRY',
            pointOfSaleId: locations,
            checkLocationExists: true,
        });
        const [machinesSortedByLastCollection, machinesSortedByLastConnection, machinesSortedByStock, offlineMachines, machinesNeverConnected,] = await bluebird_1.Promise.all([
            machinesSortedByLastCollectionPromise,
            machinesSortedByLastConnectionPromise,
            machinesSortedByStockPromise,
            offlineMachinesPromise,
            machinesNeverConnectedPromise,
        ]);
        const [onlineMachines, machinesWithoutTelemetryBoard] = await bluebird_1.Promise.all([
            onlineMachinesPromise,
            machinesWithoutTelemetryBoardPromise,
        ]);
        if (isOperator)
            return {
                machinesSortedByLastCollection,
                machinesSortedByLastConnection,
                offlineMachines,
                onlineMachines,
                machinesNeverConnected,
                machinesWithoutTelemetryBoard,
                machinesSortedByStock,
            };
        if (!startDate && !endDate && !period)
            period = period_dto_1.default.DAILY;
        if (period) {
            endDate = new Date(Date.now());
            if (period === period_dto_1.default.DAILY) {
                startDate = date_fns_1.startOfDay(endDate);
                endDate = new Date(date_fns_1.endOfDay(endDate).toUTCString());
            }
            if (period === period_dto_1.default.WEEKLY)
                startDate = date_fns_1.subWeeks(endDate, 1);
            if (period === period_dto_1.default.MONTHLY)
                startDate = date_fns_1.subMonths(endDate, 1);
        }
        if (!startDate)
            throw app_error_1.default.unknownError;
        if (!endDate)
            throw app_error_1.default.unknownError;
        if (period !== period_dto_1.default.DAILY) {
            startDate = date_fns_1.startOfDay(startDate);
            endDate = date_fns_1.endOfDay(endDate);
        }
        let chartData1 = [];
        let income = 0;
        let givenPrizesCount = 0;
        const incomeOfPeriodPromise = this.telemetryLogsRepository.getGroupIncomePerPeriod({
            groupIds,
            pointsOfSaleIds: locations,
            type: 'IN',
            withHours: period === period_dto_1.default.DAILY,
            startDate,
            endDate,
        });
        const prizesOfPeriodPromise = this.telemetryLogsRepository.getGroupIncomePerPeriod({
            groupIds,
            pointsOfSaleIds: locations,
            type: 'OUT',
            withHours: period === period_dto_1.default.DAILY,
            startDate,
            endDate,
        });
        const chartData2Promise = this.telemetryLogsRepository.getIncomePerCounterType({
            groupIds,
            pointsOfSaleIds: locations,
        });
        const [incomeOfPeriod, prizesOfPeriod, chartData2] = await bluebird_1.Promise.all([
            incomeOfPeriodPromise,
            prizesOfPeriodPromise,
            chartData2Promise,
        ]);
        // ? FATURAMENTO
        income = incomeOfPeriod.reduce((a, b) => a + b.total, 0);
        // ? PREMIOS ENTREGUES
        givenPrizesCount = prizesOfPeriod.reduce((a, b) => a + b.total, 0);
        let interval;
        if (period === period_dto_1.default.DAILY) {
            interval = date_fns_1.eachHourOfInterval({
                start: startDate,
                end: endDate,
            }).map(item => date_fns_1.addHours(item, 3));
        }
        else {
            interval = date_fns_1.eachDayOfInterval({
                start: startDate,
                end: date_fns_1.subHours(endDate, 4),
            }).map(item => date_fns_1.addHours(item, 4));
        }
        chartData1 = interval.map(item => {
            const incomeInHour = incomeOfPeriod.find(total => period === period_dto_1.default.DAILY
                ? date_fns_1.isSameHour(item, new Date(total.id))
                : date_fns_1.isSameDay(item, new Date(total.id)))?.total || 0;
            const prizesCountInHour = prizesOfPeriod.find(total => period === period_dto_1.default.DAILY
                ? date_fns_1.isSameHour(item, new Date(total.id))
                : date_fns_1.isSameDay(item, new Date(total.id)))?.total || 0;
            return {
                date: item.toISOString(),
                prizeCount: prizesCountInHour,
                income: incomeInHour,
            };
        });
        return {
            machinesSortedByLastCollection,
            machinesSortedByLastConnection,
            offlineMachines,
            onlineMachines,
            machinesNeverConnected,
            machinesWithoutTelemetryBoard,
            machinesSortedByStock,
            chartData1,
            chartData2,
            income,
            givenPrizesCount,
        };
    }
};
DashboardInfoServiceV2 = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(4, tsyringe_1.inject('RoutesRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], DashboardInfoServiceV2);
exports.default = DashboardInfoServiceV2;

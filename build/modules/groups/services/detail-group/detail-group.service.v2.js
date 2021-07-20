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
const group_1 = __importDefault(require("../../contracts/models/group"));
const groups_repository_1 = __importDefault(require("../../contracts/repositories/groups.repository"));
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const machine_1 = __importDefault(require("../../../machines/contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const point_of_sale_1 = __importDefault(require("../../../points-of-sale/contracts/models/point-of-sale"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const product_logs_repository_1 = __importDefault(require("../../../products/contracts/repositories/product-logs.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const bluebird_1 = require("bluebird");
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
let DetailGroupServiceV2 = class DetailGroupServiceV2 {
    constructor(usersRepository, groupsRepository, machinesRepository, telemetryLogsRepository, pointsOfSaleRepository, productLogsRepository) {
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.machinesRepository = machinesRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.productLogsRepository = productLogsRepository;
    }
    async execute({ userId, groupId, startDate, endDate, period, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role === role_1.default.OPERATOR)
            throw app_error_1.default.authorizationError;
        const group = await this.groupsRepository.findOne({
            by: 'id',
            value: groupId,
        });
        if (!group)
            throw app_error_1.default.groupNotFound;
        if (user.role === role_1.default.OWNER) {
            const groupIds = (await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
            })).map(group => group.id);
            if (!groupIds.includes(groupId))
                throw app_error_1.default.authorizationError;
        }
        if (user.role === role_1.default.MANAGER)
            if (!user.groupIds?.includes(groupId))
                throw app_error_1.default.authorizationError;
        const machinesSortedByLastCollectionPromise = this.machinesRepository.find({
            orderByLastCollection: true,
            groupIds: [groupId],
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
                'pointOfSale.label',
            ],
            populate: ['pointOfSale'],
        });
        const machinesSortedByLastConnectionPromise = this.machinesRepository.find({
            orderByLastConnection: true,
            groupIds: [groupId],
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
                'pointOfSale.label',
            ],
            populate: ['pointOfSale'],
        });
        const machinesSortedByStockPromise = this.machinesRepository.machineSortedByStock({
            groupIds: [groupId],
        });
        const offlineMachinesPromise = this.machinesRepository.count({
            groupIds: [groupId],
            telemetryStatus: 'OFFLINE',
        });
        const onlineMachinesPromise = this.machinesRepository.count({
            groupIds: [groupId],
            telemetryStatus: 'ONLINE',
        });
        const machinesNeverConnectedPromise = this.machinesRepository.count({
            groupIds: [groupId],
            telemetryStatus: 'VIRGIN',
        });
        const machinesWithoutTelemetryBoardPromise = this.machinesRepository.count({
            groupIds: [groupId],
            telemetryStatus: 'NO_TELEMETRY',
        });
        const [machinesSortedByLastConnection, machinesSortedByStock, offlineMachines, onlineMachines, machinesNeverConnected,] = await bluebird_1.Promise.all([
            machinesSortedByLastConnectionPromise,
            machinesSortedByStockPromise,
            offlineMachinesPromise,
            onlineMachinesPromise,
            machinesNeverConnectedPromise,
        ]);
        const [machinesWithoutTelemetryBoard, machinesSortedByLastCollection,] = await bluebird_1.Promise.all([
            machinesWithoutTelemetryBoardPromise,
            machinesSortedByLastCollectionPromise,
        ]);
        if (!startDate && !endDate && !period)
            period = period_dto_1.default.DAILY;
        if (period) {
            endDate = new Date(Date.now());
            if (period === period_dto_1.default.DAILY)
                startDate = date_fns_1.subDays(endDate, 1);
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
        startDate = date_fns_1.startOfHour(startDate);
        const incomeOfPeriodPromise = await this.telemetryLogsRepository.getGroupIncomePerPeriod({
            groupIds: [groupId],
            type: 'IN',
            withHours: period === period_dto_1.default.DAILY,
            startDate,
            endDate,
        });
        const prizesOfPeriodPromise = await this.telemetryLogsRepository.getGroupIncomePerPeriod({
            groupIds: [groupId],
            type: 'OUT',
            withHours: period === period_dto_1.default.DAILY,
            startDate,
            endDate,
        });
        const chartData2Promise = this.telemetryLogsRepository.getIncomePerCounterType({
            groupIds: [groupId],
        });
        const [incomeOfPeriod, prizesOfPeriod, chartData2] = await bluebird_1.Promise.all([
            incomeOfPeriodPromise,
            prizesOfPeriodPromise,
            chartData2Promise,
        ]);
        const lastPurchasePromise = this.productLogsRepository.findOne({
            filters: {
                logType: 'IN',
                groupId,
            },
        });
        // ? FATURAMENTO
        const income = incomeOfPeriod.reduce((a, b) => a + b.total, 0);
        // ? PREMIOS ENTREGUES
        const givenPrizesCount = prizesOfPeriod.reduce((a, b) => a + b.total, 0);
        let interval;
        if (period === period_dto_1.default.DAILY) {
            interval = date_fns_1.eachHourOfInterval({
                start: startDate,
                end: endDate,
            });
        }
        else {
            interval = date_fns_1.eachDayOfInterval({
                start: startDate,
                end: endDate,
            });
        }
        const chartData1 = interval.map(item => {
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
        const incomePerPointOfSalePromise = this.telemetryLogsRepository.incomePerPointOfSale({
            groupIds: [groupId],
            endDate,
            startDate,
        });
        const pointsOfSalePromise = this.pointsOfSaleRepository.find({
            by: 'groupId',
            value: groupId,
        });
        const [{ pointsOfSale }, incomePerPointOfSale, lastPurchase,] = await bluebird_1.Promise.all([
            pointsOfSalePromise,
            incomePerPointOfSalePromise,
            lastPurchasePromise,
        ]);
        const pointsOfSaleSortedByIncomePromises = pointsOfSale.map(async (pointOfSale) => {
            const numberOfMachines = await this.machinesRepository.count({
                groupIds: [groupId],
                pointOfSaleId: pointOfSale.id,
            });
            return {
                pointOfSale,
                income: incomePerPointOfSale.find(income => income.id === pointOfSale.id)
                    ?.income || 0,
                numberOfMachines,
            };
        });
        const pointsOfSaleSortedByIncomeResponse = await bluebird_1.Promise.all(pointsOfSaleSortedByIncomePromises);
        return {
            machinesNeverConnected,
            machinesSortedByLastCollection,
            machinesSortedByLastConnection,
            machinesSortedByStock,
            machinesWithoutTelemetryBoard,
            offlineMachines,
            onlineMachines,
            givenPrizesCount,
            income,
            chartData1,
            chartData2,
            pointsOfSaleSortedByIncome: pointsOfSaleSortedByIncomeResponse,
            lastPurchaseDate: lastPurchase?.createdAt,
            group,
        };
    }
};
DetailGroupServiceV2 = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('MachinesRepository')),
    __param(3, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(4, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(5, tsyringe_1.inject('ProductLogsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], DetailGroupServiceV2);
exports.default = DetailGroupServiceV2;

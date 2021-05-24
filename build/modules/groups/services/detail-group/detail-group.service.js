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
const groups_repository_1 = __importDefault(require("../../contracts/repositories/groups.repository"));
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const machine_1 = __importDefault(require("../../../machines/contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const point_of_sale_1 = __importDefault(require("../../../points-of-sale/contracts/models/point-of-sale"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const universal_financial_repository_1 = __importDefault(require("../../../universal-financial/contracts/repositories/universal-financial.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const bluebird_1 = require("bluebird");
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
let DetailGroupService = class DetailGroupService {
    constructor(usersRepository, groupsRepository, machinesRepository, telemetryLogsRepository, universalFinancialRepository, pointsOfSaleRepository) {
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.machinesRepository = machinesRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.universalFinancialRepository = universalFinancialRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
    }
    async execute({ userId, groupId, startDate, endDate, period, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
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
            limit: 5,
            offset: 0,
            fields: [
                'id',
                'serialNumber',
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
        const universalFinancialPromise = this.universalFinancialRepository.find({
            groupId: [groupId],
        });
        const [machinesSortedByLastConnection, machinesSortedByStock, offlineMachines, onlineMachines, machinesNeverConnected,] = await bluebird_1.Promise.all([
            machinesSortedByLastConnectionPromise,
            machinesSortedByStockPromise,
            offlineMachinesPromise,
            onlineMachinesPromise,
            machinesNeverConnectedPromise,
        ]);
        const [machinesWithoutTelemetryBoard, machinesSortedByLastCollection, universalFinancial,] = await bluebird_1.Promise.all([
            machinesWithoutTelemetryBoardPromise,
            machinesSortedByLastCollectionPromise,
            universalFinancialPromise,
        ]);
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
        let chartData1 = [];
        let income = 0;
        let givenPrizesCount = 0;
        if ((period && period === period_dto_1.default.DAILY) ||
            date_fns_1.eachDayOfInterval({
                start: startDate,
                end: endDate,
            }).length <= 1 // TODO: DAR UMA CONFERIDA SE 24 O INTERVALO É 2 OU 1
        ) {
            const telemetryLogsInPromise = this.telemetryLogsRepository.find({
                filters: {
                    date: {
                        startDate,
                        endDate,
                    },
                    groupId: [groupId],
                    maintenance: false,
                    type: 'IN',
                },
            });
            const telemetryLogsOutPromise = this.telemetryLogsRepository.find({
                filters: {
                    date: {
                        startDate,
                        endDate,
                    },
                    groupId: [groupId],
                    maintenance: false,
                    type: 'OUT',
                },
            });
            const [telemetryLogsIn, telemetryLogsOut] = await bluebird_1.Promise.all([
                telemetryLogsInPromise,
                telemetryLogsOutPromise,
            ]);
            const hoursOfInterval = date_fns_1.eachDayOfInterval({
                start: startDate,
                end: endDate,
            });
            // ? FATURAMENTO
            income = telemetryLogsIn.reduce((a, b) => a + b.value, 0);
            // ? PREMIOS ENTREGUES
            givenPrizesCount = telemetryLogsOut.reduce((a, b) => a + b.value, 0);
            chartData1 = hoursOfInterval.map(hour => {
                const incomeInHour = telemetryLogsIn
                    .filter(telemetry => date_fns_1.isSameHour(hour, telemetry.date))
                    .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                const prizesCountInHour = telemetryLogsOut
                    .filter(telemetry => date_fns_1.isSameHour(hour, telemetry.date))
                    .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                return {
                    date: hour.toISOString(),
                    prizeCount: prizesCountInHour,
                    income: incomeInHour,
                };
            });
        }
        if (period !== period_dto_1.default.DAILY) {
            // ? FATURAMENTO
            income = universalFinancial.reduce((a, b) => a + (b.cashIncome + b.coinIncome + b.creditCardIncome + b.others), 0);
            // ? PREMIOS ENTREGUES
            givenPrizesCount = universalFinancial.reduce((a, b) => a + b.givenPrizes, 0);
            const daysOfInterval = date_fns_1.eachDayOfInterval({
                start: startDate,
                end: endDate,
            });
            chartData1 = daysOfInterval.map(day => {
                const incomeInDay = universalFinancial
                    .filter(item => date_fns_1.isSameDay(day, item.date))
                    .reduce((accumulator, currentValue) => accumulator +
                    (currentValue.cashIncome +
                        currentValue.coinIncome +
                        currentValue.creditCardIncome +
                        currentValue.others), 0);
                const prizesCountInDay = universalFinancial
                    .filter(item => date_fns_1.isSameDay(day, item.date))
                    .reduce((accumulator, currentValue) => accumulator + currentValue.givenPrizes, 0);
                return {
                    date: day.toISOString(),
                    prizeCount: prizesCountInDay,
                    income: incomeInDay,
                };
            });
        }
        let cashIncome = 0;
        let coinIncome = 0;
        let creditCardIncome = 0;
        let others = 0;
        universalFinancial.forEach(item => {
            cashIncome += item.cashIncome;
            coinIncome += item.coinIncome;
            creditCardIncome += item.creditCardIncome;
            others += item.others;
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
        const [{ pointsOfSale }, incomePerPointOfSale] = await bluebird_1.Promise.all([
            pointsOfSalePromise,
            incomePerPointOfSalePromise,
        ]);
        const incomePerPointOfSalePromises = pointsOfSale.map(async (pointOfSale) => {
            const numberOfMachines = await this.machinesRepository.count({
                groupIds: [groupId],
                pointOfSaleId: pointOfSale.id,
            });
            return {
                pointOfSale,
                income: incomePerPointOfSale.find(income => income.id === pointOfSale.id)?.income,
                numberOfMachines,
            };
        });
        const incomePerPointOfSaleResponse = await bluebird_1.Promise.all(incomePerPointOfSalePromises);
        const chartData2 = {
            cashIncome,
            coinIncome,
            creditCardIncome,
            others,
        };
        return {
            machinesNeverConnected,
            machinesSortedByLastCollection: machinesSortedByLastCollection.machines,
            machinesSortedByLastConnection: machinesSortedByLastConnection.machines,
            machinesSortedByStock,
            machinesWithoutTelemetryBoard,
            offlineMachines,
            onlineMachines,
            givenPrizesCount,
            income,
            chartData1,
            chartData2,
            incomePerPointOfSale: incomePerPointOfSaleResponse,
        };
    }
};
DetailGroupService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('MachinesRepository')),
    __param(3, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(4, tsyringe_1.inject('UniversalFinancialRepository')),
    __param(5, tsyringe_1.inject('PointsOfSaleRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], DetailGroupService);
exports.default = DetailGroupService;

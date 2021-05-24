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
const universal_financial_repository_1 = __importDefault(require("../../../universal-financial/contracts/repositories/universal-financial.repository"));
const universal_financial_1 = __importDefault(require("../../../universal-financial/contracts/entities/universal-financial"));
let DashboardInfoService = class DashboardInfoService {
    constructor(usersRepository, machinesRepository, groupsRepository, telemetryLogsRepository, universalFinancialRepository) {
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.groupsRepository = groupsRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.universalFinancialRepository = universalFinancialRepository;
    }
    async execute({ userId, period, startDate, endDate, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const isOperator = user.role === role_1.default.OPERATOR;
        let groupIds = [];
        if (user.role === role_1.default.OWNER)
            groupIds = (await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
            })).map(group => group.id);
        const machinesSortedByLastCollection = (await this.machinesRepository.find({
            orderByLastCollection: true,
            operatorId: isOperator ? user.id : undefined,
            groupIds,
            limit: 5,
            offset: 0,
            fields: [
                'id',
                'serialNumber',
                'lastCollection',
                'lastConnection',
                'pointOfSaleId',
                'pointOfSale',
            ],
            populate: ['pointOfSale'],
        })).machines;
        const machinesSortedByLastConnection = (await this.machinesRepository.find({
            orderByLastConnection: true,
            operatorId: isOperator ? user.id : undefined,
            groupIds: isOperator ? undefined : groupIds,
            limit: 5,
            offset: 0,
            fields: [
                'id',
                'serialNumber',
                'lastConnection',
                'lastCollection',
                'pointOfSaleId',
                'pointOfSale',
            ],
            populate: ['pointOfSale'],
        })).machines;
        const machinesSortedByStock = await this.machinesRepository.machineSortedByStock({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
        });
        const offlineMachines = await this.machinesRepository.count({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
            telemetryStatus: 'OFFLINE',
        });
        const onlineMachines = await this.machinesRepository.count({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
            telemetryStatus: 'ONLINE',
        });
        const machinesNeverConnected = await this.machinesRepository.count({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
            telemetryStatus: 'VIRGIN',
        });
        const machinesWithoutTelemetryBoard = await this.machinesRepository.count({
            groupIds: isOperator ? undefined : groupIds,
            operatorId: isOperator ? user.id : undefined,
            telemetryStatus: 'NO_TELEMETRY',
        });
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
        if (!isOperator)
            if ((period && period === period_dto_1.default.DAILY) ||
                date_fns_1.eachDayOfInterval({
                    start: startDate,
                    end: endDate,
                }).length <= 1 // TODO: DAR UMA CONFERIDA SE 24 O INTERVALO É 2 OU 1
            ) {
                const telemetryLogsInPromise = async () => {
                    const response = await this.telemetryLogsRepository.find({
                        filters: {
                            date: {
                                startDate,
                                endDate,
                            },
                            groupId: groupIds,
                            maintenance: false,
                            type: 'IN',
                        },
                    });
                    return response;
                };
                const telemetryLogsOutPromise = async () => {
                    const response = await this.telemetryLogsRepository.find({
                        filters: {
                            date: {
                                startDate,
                                endDate,
                            },
                            groupId: groupIds,
                            maintenance: false,
                            type: 'OUT',
                        },
                    });
                    return response;
                };
                const [telemetryLogsIn, telemetryLogsOut] = await bluebird_1.Promise.all([
                    await telemetryLogsInPromise(),
                    await telemetryLogsOutPromise(),
                ]);
                const hoursOfInterval = date_fns_1.eachDayOfInterval({
                    start: startDate,
                    end: endDate,
                });
                // ? FATURAMENTO
                income = telemetryLogsIn.reduce((a, b) => a + b.value, 0);
                // ? PREMIOS ENTREGUES
                givenPrizesCount = telemetryLogsOut.reduce((a, b) => a + b.value, 0);
                if (!isOperator)
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
        let universalFinancial = [];
        if (!isOperator)
            universalFinancial = await this.universalFinancialRepository.find({
                groupId: groupIds,
            });
        if (!isOperator)
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
        return {
            machinesSortedByLastCollection,
            machinesSortedByLastConnection,
            offlineMachines,
            onlineMachines,
            machinesNeverConnected,
            machinesWithoutTelemetryBoard,
            machinesSortedByStock,
            chartData1,
            chartData2: {
                cashIncome,
                coinIncome,
                creditCardIncome,
                others,
            },
            income,
            givenPrizesCount,
        };
    }
};
DashboardInfoService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(4, tsyringe_1.inject('UniversalFinancialRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], DashboardInfoService);
exports.default = DashboardInfoService;

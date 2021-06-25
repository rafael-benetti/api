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
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
const bluebird_1 = require("bluebird");
const group_1 = __importDefault(require("../../../groups/contracts/models/group"));
const address_1 = __importDefault(require("../../../points-of-sale/contracts/models/address"));
const machine_log_type_1 = __importDefault(require("../../../machine-logs/contracts/enums/machine-log-type"));
const machine_logs_repository_1 = __importDefault(require("../../../machine-logs/contracts/repositories/machine-logs.repository"));
const export_points_of_sale_report_1 = __importDefault(require("./export-points-of-sale-report"));
let GeneratePointsOfSaleReportService = class GeneratePointsOfSaleReportService {
    constructor(usersRepository, pointsOfSaleRepository, groupsRepository, machinesRepository, telemetryLogsRepository, machineLogsRepository) {
        this.usersRepository = usersRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.groupsRepository = groupsRepository;
        this.machinesRepository = machinesRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.machineLogsRepository = machineLogsRepository;
    }
    async execute({ userId, groupId, startDate, endDate, download, pointsOfSaleIds, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.MANAGER && user.role !== role_1.default.OWNER)
            throw app_error_1.default.authorizationError;
        if (user.role !== role_1.default.OWNER && !user.permissions?.generateReports)
            throw app_error_1.default.authorizationError;
        let groupIds = [];
        let groups = [];
        if (groupId && !pointsOfSaleIds) {
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
        else if (user.role === role_1.default.MANAGER && !pointsOfSaleIds) {
            if (!user.groupIds)
                throw app_error_1.default.unknownError;
            groupIds = user.groupIds;
            groups = await this.groupsRepository.find({
                filters: {
                    ids: user.groupIds,
                },
            });
        }
        else if (user.role === role_1.default.OWNER && !pointsOfSaleIds) {
            groups = await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
                fields: ['id', 'label'],
            });
            groupIds = groups.map(group => group.id);
        }
        let pointsOfSale;
        if (pointsOfSaleIds) {
            pointsOfSale = (await this.pointsOfSaleRepository.find({
                by: 'id',
                value: pointsOfSaleIds,
                fields: ['id', 'label', 'address', 'groupId', 'isPercentage', 'rent'],
            })).pointsOfSale;
        }
        else {
            pointsOfSale = (await this.pointsOfSaleRepository.find({
                by: 'groupId',
                value: groupIds,
                fields: ['id', 'label', 'address', 'groupId', 'isPercentage', 'rent'],
            })).pointsOfSale;
        }
        startDate = date_fns_1.startOfDay(startDate);
        endDate = date_fns_1.endOfDay(endDate);
        const days = date_fns_1.differenceInDays(endDate, startDate) !== 0
            ? date_fns_1.differenceInDays(endDate, startDate)
            : 1;
        const reportsPromises = pointsOfSale.map(async (pointOfSale) => {
            const { machines } = await this.machinesRepository.find({
                pointOfSaleId: pointOfSale.id,
                fields: [
                    'id',
                    'serialNumber',
                    'incomePerMonthGoal',
                    'incomePerPrizeGoal',
                    'gameValue',
                    'categoryLabel',
                ],
            });
            const { machineLogs: machinesLogs, } = await this.machineLogsRepository.find({
                groupId: groupIds,
                machineId: machines.map(machine => machine.id),
                endDate,
                startDate,
                type: machine_log_type_1.default.REMOTE_CREDIT,
            });
            const incomePerMachine = await this.telemetryLogsRepository.getIncomePerMachine({ groupIds, endDate, startDate });
            const prizesPerMachine = await this.telemetryLogsRepository.getPrizesPerMachine({
                endDate,
                groupIds,
                startDate,
            });
            const machineAnalyticsPromises = machines.map(async (machine) => {
                const telemetryLogs = await this.telemetryLogsRepository.find({
                    filters: {
                        date: {
                            startDate,
                            endDate,
                        },
                        groupId,
                        machineId: machine.id,
                        maintenance: false,
                        pointOfSaleId: pointOfSale.id,
                    },
                });
                const remoteCreditAmount = machinesLogs
                    .filter(machineLog => machineLog.machineId === machine.id)
                    .reduce((a, b) => a + b.quantity, 0);
                const income = telemetryLogs
                    .filter(telemetryLog => telemetryLog.type === 'IN')
                    .reduce((a, b) => a + b.value, 0);
                const prizes = prizesPerMachine.find(prizes => prizes.id === machine.id)
                    ?.prizes;
                const numberOfPlays = (incomePerMachine.find(machineIncome => machineIncome.id === machine.id)?.income || 0) / machine.gameValue;
                const averagePerDay = Number((income / days).toFixed(2));
                const { incomePerMonthGoal } = machine;
                const { incomePerPrizeGoal } = machine;
                return {
                    serialNumber: machine.serialNumber,
                    category: machine.categoryLabel,
                    income: income || 0,
                    prizes: prizes || 0,
                    remoteCreditAmount: remoteCreditAmount || 0,
                    numberOfPlays: numberOfPlays
                        ? Number(numberOfPlays.toFixed(2))
                        : numberOfPlays,
                    gameValue: machine.gameValue,
                    playsPerPrize: numberOfPlays && prizes
                        ? Number((numberOfPlays / prizes).toFixed(2))
                        : 0,
                    incomePerMonthGoal,
                    incomePerPrizeGoal,
                    averagePerDay: averagePerDay || 0,
                };
            });
            const machineAnalytics = await bluebird_1.Promise.all(machineAnalyticsPromises);
            const groupLabel = groups.find(group => group.id === pointOfSale.groupId)
                ?.label;
            const rent = pointOfSale.isPercentage
                ? (machineAnalytics.reduce((a, b) => a + b.income, 0) *
                    pointOfSale.rent) /
                    100
                : pointOfSale.rent;
            return {
                label: pointOfSale.label,
                rent: rent || 0,
                income: machineAnalytics.reduce((a, b) => a + b.income, 0),
                address: pointOfSale.address,
                groupLabel: groupLabel || 'Parceria Pessoal',
                machineAnalytics,
            };
        });
        const pointsOfSaleAnalytics = await bluebird_1.Promise.all(reportsPromises);
        if (download) {
            const Workbook = await export_points_of_sale_report_1.default({
                date: {
                    startDate,
                    endDate,
                },
                pointsOfSaleAnalytics,
            });
            return Workbook;
        }
        return {
            date: {
                startDate,
                endDate,
            },
            pointsOfSaleAnalytics,
        };
    }
};
GeneratePointsOfSaleReportService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('MachinesRepository')),
    __param(4, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(5, tsyringe_1.inject('MachineLogsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], GeneratePointsOfSaleReportService);
exports.default = GeneratePointsOfSaleReportService;

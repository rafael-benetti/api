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
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const tsyringe_1 = require("tsyringe");
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const group_1 = __importDefault(require("../../../groups/contracts/models/group"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const machine_logs_repository_1 = __importDefault(require("../../../machine-logs/contracts/repositories/machine-logs.repository"));
const machine_log_type_1 = __importDefault(require("../../../machine-logs/contracts/enums/machine-log-type"));
const date_fns_1 = require("date-fns");
const export_machines_report_1 = __importDefault(require("./export-machines-report"));
let GenerateMachinesReportService = class GenerateMachinesReportService {
    constructor(usersRepository, machineLogsRepository, groupsRepository, machinesRepository, telemetryLogsRepository) {
        this.usersRepository = usersRepository;
        this.machineLogsRepository = machineLogsRepository;
        this.groupsRepository = groupsRepository;
        this.machinesRepository = machinesRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
    }
    async execute({ userId, groupId, startDate, endDate, download, machineIds, }) {
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
        if (groupId && !machineIds) {
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
        else if (user.role === role_1.default.MANAGER && !machineIds) {
            if (!user.groupIds)
                throw app_error_1.default.unknownError;
            groupIds = user.groupIds;
            groups = await this.groupsRepository.find({
                filters: {
                    ids: user.groupIds,
                },
            });
        }
        else if (user.role === role_1.default.OWNER && !machineIds) {
            groups = await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
                fields: ['id', 'label'],
            });
            groupIds = groups.map(group => group.id);
        }
        let machines;
        if (machineIds) {
            machines = (await this.machinesRepository.find({
                id: machineIds,
                populate: ['pointOfSale'],
                fields: [
                    'id',
                    'serialNumber',
                    'categoryLabel',
                    'gameValue',
                    'locationId',
                    'incomePerPrizeGoal',
                    'incomePerMonthGoal',
                    'pointOfSale',
                    'pointOfSale.id',
                    'pointOfSale.label',
                    'groupId',
                    'ownerId',
                ],
            })).machines;
            if (user.role === role_1.default.OWNER)
                if (machines.some(machine => machine.ownerId !== user.id))
                    throw app_error_1.default.authorizationError;
            if (user.role === role_1.default.MANAGER)
                if (machines.some(machine => !user.groupIds?.includes(machine.groupId)))
                    throw app_error_1.default.authorizationError;
        }
        else {
            machines = (await this.machinesRepository.find({
                groupIds,
                populate: ['pointOfSale'],
                fields: [
                    'id',
                    'serialNumber',
                    'categoryLabel',
                    'gameValue',
                    'locationId',
                    'incomePerPrizeGoal',
                    'incomePerMonthGoal',
                    'pointOfSale',
                    'pointOfSale.id',
                    'pointOfSale.label',
                    'groupId',
                ],
            })).machines;
        }
        startDate = date_fns_1.startOfDay(startDate);
        endDate = date_fns_1.endOfDay(endDate);
        const incomePerMachine = await this.telemetryLogsRepository.getIncomePerMachine({ groupIds, endDate, startDate });
        const prizesPerMachine = await this.telemetryLogsRepository.getPrizesPerMachine({
            endDate,
            groupIds,
            startDate,
        });
        const { machineLogs: machinesLogs } = await this.machineLogsRepository.find({
            groupId: groupIds,
            machineId: machines.map(machine => machine.id),
            endDate,
            startDate,
            type: machine_log_type_1.default.REMOTE_CREDIT,
        });
        const numberOfDays = date_fns_1.differenceInDays(endDate, startDate) !== 0
            ? date_fns_1.differenceInDays(endDate, startDate)
            : 1;
        const machineAnalytics = machines.map(machine => {
            const remoteCreditAmount = machinesLogs
                .filter(machineLog => machineLog.machineId === machine.id)
                .reduce((a, b) => a + b.quantity, 0);
            const numberOfPlays = incomePerMachine.find(machineIncome => machineIncome.id === machine.id)?.numberOfPlays;
            const prizes = prizesPerMachine.find(prizes => prizes.id === machine.id)
                ?.prizes;
            const income = incomePerMachine.find(machineIncome => machineIncome.id === machine.id)?.income;
            const groupLabel = groups.find(group => group.id === machine.groupId)?.label ||
                'Parceria Pessoal';
            return {
                groupLabel,
                serialNumber: machine.serialNumber,
                location: machine.pointOfSale?.label || '',
                category: machine.categoryLabel,
                income: income || 0,
                prizes: prizes || 0,
                remoteCreditAmount: remoteCreditAmount || 0,
                numberOfPlays: numberOfPlays || 0,
                gameValue: machine.gameValue,
                playsPerPrize: numberOfPlays && prizes
                    ? Number((numberOfPlays / prizes).toFixed(2))
                    : 0,
                incomePerPrizeGoal: machine.incomePerPrizeGoal || 0,
                incomePerMonthGoal: machine.incomePerMonthGoal || 0,
                averagePerDay: Number((income ? income / numberOfDays : 0).toFixed(2)) || 0,
            };
        });
        if (download) {
            const Workbook = await export_machines_report_1.default({
                date: {
                    startDate,
                    endDate,
                },
                machineAnalytics,
            });
            return Workbook;
        }
        return {
            date: {
                startDate,
                endDate,
            },
            machineAnalytics,
        };
    }
};
GenerateMachinesReportService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachineLogsRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('MachinesRepository')),
    __param(4, tsyringe_1.inject('TelemetryLogsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GenerateMachinesReportService);
exports.default = GenerateMachinesReportService;

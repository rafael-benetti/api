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
const date_fns_1 = require("date-fns");
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const tsyringe_1 = require("tsyringe");
const product_logs_repository_1 = __importDefault(require("../../../products/contracts/repositories/product-logs.repository"));
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
let GenerateGroupReportService = class GenerateGroupReportService {
    constructor(usersRepository, telemetryLogsRepository, productLogsRepository, groupsRepository) {
        this.usersRepository = usersRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.productLogsRepository = productLogsRepository;
        this.groupsRepository = groupsRepository;
    }
    async execute({ userId, dates }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && !user.permissions?.generateReports)
            throw app_error_1.default.authorizationError;
        const universe = await get_group_universe_1.default(user);
        const groups = await this.groupsRepository.find({
            filters: {
                ids: universe,
            },
        });
        return Promise.all(groups.map(async (group) => {
            const telemetryLogs = await this.telemetryLogsRepository.find({
                filters: {
                    groupId: group.id,
                    date: dates,
                },
            });
            const plays = telemetryLogs.filter(log => log.type === 'IN');
            const income = plays.map(log => log.value).reduce((a, b) => a + b, 0);
            const givenPrizes = telemetryLogs
                .filter(log => log.type === 'OUT')
                .map(log => log.value)
                .reduce((a, b) => a + b, 0);
            const playsPerPrize = plays.length / (givenPrizes === 0 ? 1 : givenPrizes);
            const numberOfDays = date_fns_1.differenceInCalendarDays(dates.endDate, dates.startDate);
            const averageIncomePerDay = income / numberOfDays;
            const productLogs = await this.productLogsRepository.find({
                filters: {
                    groupId: group.id,
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                },
            });
            console.log(productLogs);
            const productExpenses = productLogs
                .filter(log => log.logType === 'IN')
                .map(log => log.cost * log.quantity)
                .reduce((a, b) => a + b, 0);
            const productGains = productLogs
                .filter(log => log.logType === 'OUT')
                .map(log => log.cost * log.quantity)
                .reduce((a, b) => a + b, 0);
            return {
                groupLabel: group.label,
                groupId: group.id,
                income,
                averageIncomePerDay,
                plays: plays.length,
                givenPrizes,
                playsPerPrize,
                productExpenses,
                productGains,
                profit: income + productGains - productExpenses,
            };
        }));
    }
};
GenerateGroupReportService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(2, tsyringe_1.inject('ProductLogsRepository')),
    __param(3, tsyringe_1.inject('GroupsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GenerateGroupReportService);
exports.default = GenerateGroupReportService;

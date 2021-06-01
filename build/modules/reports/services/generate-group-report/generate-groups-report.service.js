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
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const tsyringe_1 = require("tsyringe");
const product_logs_repository_1 = __importDefault(require("../../../products/contracts/repositories/product-logs.repository"));
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const bluebird_1 = require("bluebird");
const machine_logs_repository_1 = __importDefault(require("../../../machine-logs/contracts/repositories/machine-logs.repository"));
const machine_log_type_1 = __importDefault(require("../../../machine-logs/contracts/enums/machine-log-type"));
const date_fns_1 = require("date-fns");
const logger_1 = __importDefault(require("../../../../config/logger"));
const export_groups_report_1 = __importDefault(require("./export-groups-report"));
let GenerateGroupReportService = class GenerateGroupReportService {
    constructor(usersRepository, telemetryLogsRepository, groupsRepository, machinesRepository, productLogsRepository, pointsOfSaleRepository, machineLogsRepository) {
        this.usersRepository = usersRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.groupsRepository = groupsRepository;
        this.machinesRepository = machinesRepository;
        this.productLogsRepository = productLogsRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.machineLogsRepository = machineLogsRepository;
    }
    async execute({ userId, endDate, startDate, download, groupIds, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && !user.permissions?.generateReports)
            throw app_error_1.default.authorizationError;
        const universe = await get_group_universe_1.default(user);
        let groups;
        if (groupIds) {
            groups = await this.groupsRepository.find({
                filters: {
                    ids: groupIds,
                },
            });
            logger_1.default.info(groupIds);
            if (user.role === role_1.default.OWNER)
                if (groups.some(group => group.ownerId !== user.id))
                    throw app_error_1.default.authorizationError;
            logger_1.default.info('ai');
            if (user.role === role_1.default.MANAGER)
                if (groups.some(group => !user.groupIds?.includes(group.id)))
                    throw app_error_1.default.authorizationError;
        }
        else {
            groups = await this.groupsRepository.find({
                filters: {
                    ids: universe,
                },
            });
        }
        startDate = date_fns_1.startOfDay(startDate);
        endDate = date_fns_1.endOfDay(endDate);
        const groupsAnalytics = await bluebird_1.Promise.all(groups.map(async (group) => {
            const numberOfMachinesPromise = this.machinesRepository.count({
                groupIds: [group.id],
            });
            const incomePerPointOfSalePromise = this.telemetryLogsRepository.incomePerPointOfSale({
                groupIds: [group.id],
                endDate,
                startDate,
            });
            const pointsOfSalePromise = this.pointsOfSaleRepository.find({
                by: 'groupId',
                value: group.id,
            });
            const productLogsPromise = this.productLogsRepository.find({
                filters: {
                    endDate,
                    startDate,
                    groupId: group.id,
                    logType: 'IN',
                },
            });
            const remoteCreditsPromise = this.machineLogsRepository.find({
                startDate,
                endDate,
                groupId: group.id,
                type: machine_log_type_1.default.REMOTE_CREDIT,
            });
            const [numberOfMachines, incomePerPointOfSale, { pointsOfSale }, productLogs, { machineLogs },] = await bluebird_1.Promise.all([
                numberOfMachinesPromise,
                incomePerPointOfSalePromise,
                pointsOfSalePromise,
                productLogsPromise,
                remoteCreditsPromise,
            ]);
            const income = incomePerPointOfSale.reduce((a, b) => a + b.income, 0);
            const productLogsPrizes = productLogs.filter(productLog => productLog.productType === 'PRIZE');
            const prizePurchaseAmount = productLogsPrizes.reduce((a, b) => a + b.quantity, 0);
            const prizePurchaseCost = productLogsPrizes.reduce((a, b) => {
                return b.logType === 'IN'
                    ? a + b.cost * b.quantity
                    : a - b.cost * b.quantity;
            }, 0);
            const maintenance = productLogs
                .filter(productLog => productLog.productType === 'SUPPLY')
                .reduce((a, b) => {
                return b.logType === 'IN'
                    ? a + b.cost * b.quantity
                    : a - b.cost * b.quantity;
            }, 0);
            const rent = pointsOfSale
                .map(pointOfSale => pointOfSale.isPercentage
                ? (incomePerPointOfSale.find(pointOfSaleIncome => pointOfSaleIncome.id === pointOfSale.id)?.income ?? 0) *
                    (pointOfSale.rent / 100)
                : pointOfSale.rent)
                .reduce((a, b) => a + b, 0);
            const remoteCreditCost = machineLogs.reduce((a, b) => a + b.quantity, 0);
            const balance = income - (prizePurchaseCost + maintenance + rent);
            return {
                groupLabel: group.label ? group.label : 'Parceria Pessoal',
                numberOfMachines: numberOfMachines || 0,
                income: income || 0,
                prizePurchaseAmount: prizePurchaseAmount || 0,
                prizePurchaseCost: prizePurchaseCost || 0,
                maintenance: maintenance || 0,
                rent: rent || 0,
                remoteCreditCost: remoteCreditCost || 0,
                balance: balance || 0,
            };
        }));
        if (download) {
            const Workbook = await export_groups_report_1.default({
                date: {
                    startDate,
                    endDate,
                },
                groupsAnalytics,
            });
            return Workbook;
        }
        return {
            date: {
                startDate,
                endDate,
            },
            groupsAnalytics,
        };
    }
};
GenerateGroupReportService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('MachinesRepository')),
    __param(4, tsyringe_1.inject('ProductLogsRepository')),
    __param(5, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(6, tsyringe_1.inject('MachineLogsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], GenerateGroupReportService);
exports.default = GenerateGroupReportService;

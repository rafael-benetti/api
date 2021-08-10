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
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const machine_1 = __importDefault(require("../../../machines/contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const point_of_sale_1 = __importDefault(require("../../contracts/models/point-of-sale"));
const points_of_sale_repository_1 = __importDefault(require("../../contracts/repositories/points-of-sale.repository"));
const route_1 = __importDefault(require("../../../routes/contracts/models/route"));
const routes_repository_1 = __importDefault(require("../../../routes/contracts/repositories/routes.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
let GetPointOfSaleDetailsService = class GetPointOfSaleDetailsService {
    constructor(pointsOfSaleRepository, usersRepository, machinesRepository, telemetryLogsRepository, routesRepository) {
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.routesRepository = routesRepository;
    }
    async execute({ userId, pointOfSaleId, period, startDate, endDate, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const pointOfSale = await this.pointsOfSaleRepository.findOne({
            by: 'id',
            value: pointOfSaleId,
            populate: ['group'],
        });
        if (!pointOfSale)
            throw app_error_1.default.pointOfSaleNotFound;
        if (user.role === role_1.default.OWNER && user.id !== pointOfSale.ownerId)
            throw app_error_1.default.authorizationError;
        if ((user.role === role_1.default.MANAGER || user.role === role_1.default.OPERATOR) &&
            !user.groupIds?.includes(pointOfSale.groupId))
            throw app_error_1.default.authorizationError;
        const machines = await this.machinesRepository.find({
            pointOfSaleId,
            isActive: true,
        });
        let route;
        if (pointOfSale.routeId) {
            route = await this.routesRepository.findOne({
                id: pointOfSale.routeId,
            });
        }
        if (period) {
            endDate = new Date(Date.now());
            if (period === period_dto_1.default.DAILY) {
                startDate = date_fns_1.startOfDay(endDate);
                endDate = date_fns_1.endOfDay(endDate);
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
        const telemetryLogs = await this.telemetryLogsRepository.getPointOfSaleIncomePerDate({
            endDate,
            pointOfSaleId,
            startDate,
            withHours: period === period_dto_1.default.DAILY,
        });
        const telemetryLogsIn = telemetryLogs.filter(telemetryLog => telemetryLog.id.type === 'IN');
        const telemetryLogsOut = telemetryLogs.filter(telemetryLog => telemetryLog.id.type === 'OUT');
        // ? FATURAMENTO
        const income = telemetryLogsIn.reduce((a, b) => a + b.total, 0);
        // ? PREMIOS ENTREGUES
        const givenPrizesCount = telemetryLogsOut.reduce((a, b) => a + b.total, 0);
        let chartData = [];
        // ? CHART DATA PARA O PERIODO DIARIO
        if (period && period === period_dto_1.default.DAILY) {
            const hoursOfInterval = date_fns_1.eachHourOfInterval({
                start: startDate,
                end: endDate,
            }).map(item => date_fns_1.addHours(item, 3));
            chartData = hoursOfInterval.map(hour => {
                const incomeInHour = telemetryLogsIn
                    .filter(telemetry => date_fns_1.isSameHour(hour, new Date(telemetry.id.date)))
                    .reduce((a, b) => a + b.total, 0) || 0;
                const prizesCountInHour = telemetryLogsOut
                    .filter(telemetry => date_fns_1.isSameHour(hour, new Date(telemetry.id.date)))
                    .reduce((a, b) => a + b.total, 0) || 0;
                return {
                    date: hour.toISOString(),
                    prizeCount: prizesCountInHour,
                    income: incomeInHour,
                };
            });
        }
        // ? CHART DATA PARA PERIODO SEMANAL E MENSAL
        if (period !== period_dto_1.default.DAILY) {
            const daysOfInterval = date_fns_1.eachDayOfInterval({
                start: startDate,
                end: date_fns_1.subHours(endDate, 4),
            }).map(item => date_fns_1.addHours(item, 4));
            chartData = daysOfInterval.map(day => {
                const incomeInDay = telemetryLogsIn
                    .filter(telemetry => date_fns_1.isSameDay(day, new Date(telemetry.id.date)))
                    .reduce((a, b) => a + b.total, 0) || 0;
                const prizesCountInDay = telemetryLogsOut
                    .filter(telemetry => date_fns_1.isSameDay(day, new Date(telemetry.id.date)))
                    .reduce((a, b) => a + b.total, 0) || 0;
                return {
                    date: day.toISOString(),
                    prizeCount: prizesCountInDay,
                    income: incomeInDay,
                };
            });
        }
        const machinesInfo = machines.map(machine => {
            return {
                machine,
                income: telemetryLogsIn
                    .filter(telemetryLog => telemetryLog.id.machineId === machine.id)
                    .reduce((a, b) => a + b.total, 0),
                givenPrizes: telemetryLogsOut
                    .filter(telemetryLog => telemetryLog.id.machineId === machine.id)
                    .reduce((a, b) => a + b.total, 0),
            };
        });
        return {
            pointOfSale,
            machinesInfo,
            route,
            chartData,
            givenPrizesCount,
            income,
        };
    }
};
GetPointOfSaleDetailsService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('MachinesRepository')),
    __param(3, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(4, tsyringe_1.inject('RoutesRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GetPointOfSaleDetailsService);
exports.default = GetPointOfSaleDetailsService;

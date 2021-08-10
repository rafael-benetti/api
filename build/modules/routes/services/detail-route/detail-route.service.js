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
const point_of_sale_1 = __importDefault(require("../../../points-of-sale/contracts/models/point-of-sale"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const route_1 = __importDefault(require("../../contracts/models/route"));
const routes_repository_1 = __importDefault(require("../../contracts/repositories/routes.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const user_1 = __importDefault(require("../../../users/contracts/models/user"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
let DetailRouteService = class DetailRouteService {
    constructor(routesRepository, usersRepository, pointsOfSaleRepository, telemetryLogsRepository, machinesRepository) {
        this.routesRepository = routesRepository;
        this.usersRepository = usersRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.machinesRepository = machinesRepository;
    }
    async execute({ userId, routeId, period, endDate, startDate, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const route = await this.routesRepository.findOne({
            id: routeId,
        });
        if (!route)
            throw app_error_1.default.routeNotFound;
        if (user.role === role_1.default.OPERATOR && route?.operatorId !== user.id)
            throw app_error_1.default.authorizationError;
        if (user.role === role_1.default.MANAGER) {
            const checkRoutesGroups = route?.groupIds.some(groupId => !user.groupIds?.includes(groupId));
            if (checkRoutesGroups)
                throw app_error_1.default.authorizationError;
        }
        if (user.role === role_1.default.OWNER && user.id !== route.ownerId)
            throw app_error_1.default.authorizationError;
        const { pointsOfSale } = await this.pointsOfSaleRepository.find({
            by: 'routeId',
            value: route.id,
            populate: ['group'],
        });
        let operator;
        if (route.operatorId)
            operator = await this.usersRepository.findOne({
                by: 'id',
                value: route.operatorId,
                fields: [
                    'name',
                    'groupIds',
                    'email',
                    'role',
                    'groupIds',
                    'permissions',
                ],
            });
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
        const telemetryLogs = await this.telemetryLogsRepository.find({
            filters: {
                routeId,
                date: {
                    startDate: date_fns_1.addHours(startDate, 3),
                    endDate: date_fns_1.addHours(endDate, 3),
                },
            },
        });
        const telemetryLogsIn = telemetryLogs.filter(telemetryLog => telemetryLog.type === 'IN');
        const telemetryLogsOut = telemetryLogs.filter(telemetryLog => telemetryLog.type === 'OUT');
        // ? FATURAMENTO
        const income = telemetryLogsIn.reduce((a, b) => a + b.value, 0);
        // ? PREMIOS ENTREGUES
        const givenPrizesCount = telemetryLogsOut.reduce((a, b) => a + b.value, 0);
        let chartData1 = [];
        // ? CHART DATA PARA O PERIODO DIARIO
        if (period && period === period_dto_1.default.DAILY) {
            const hoursOfInterval = date_fns_1.eachHourOfInterval({
                start: startDate,
                end: endDate,
            }).map(item => date_fns_1.addHours(item, 3));
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
        // ? MACHINES ORDERED
        const machines = await this.machinesRepository.find({
            pointOfSaleId: pointsOfSale.map(pointOfSale => pointOfSale.id),
            orderByLastCollection: true,
            checkLastCollectionExists: false,
            fields: [
                'pointOfSale',
                'pointOfSale.label',
                'serialNumber',
                'categoryLabel',
                'lastCollection',
                'id',
            ],
        });
        // ? CHART DATA PARA PERIODO SEMANAL E MENSAL
        if (period === period_dto_1.default.MONTHLY || period === period_dto_1.default.WEEKLY) {
            const daysOfInterval = date_fns_1.eachDayOfInterval({
                start: startDate,
                end: date_fns_1.subHours(endDate, 4),
            }).map(item => date_fns_1.addHours(item, 4));
            chartData1 = daysOfInterval.map(day => {
                const incomeInDay = telemetryLogsIn
                    .filter(telemetry => date_fns_1.isSameDay(day, telemetry.date))
                    .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                const prizesCountInDay = telemetryLogsOut
                    .filter(telemetry => date_fns_1.isSameDay(day, telemetry.date))
                    .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                return {
                    date: day.toISOString(),
                    prizeCount: prizesCountInDay,
                    income: incomeInDay,
                };
            });
        }
        const chartData2 = pointsOfSale.map(pointOfSale => {
            const telemetryLogsOfPointOfSaleIn = telemetryLogsIn.filter(telemetryLogIn => telemetryLogIn.pointOfSaleId === pointOfSale.id);
            const telemetryLogsOfPointOfSaleOut = telemetryLogsOut.filter(telemetryLogOut => telemetryLogOut.pointOfSaleId === pointOfSale.id);
            const income = telemetryLogsOfPointOfSaleIn.reduce((a, b) => a + b.value, 0);
            const givenPrizesCount = telemetryLogsOfPointOfSaleOut.reduce((a, b) => a + b.value, 0);
            return {
                pointOfSaleId: pointOfSale.id,
                label: pointOfSale.label,
                income,
                givenPrizesCount,
            };
        });
        return {
            // TODO TIRAR A SENHA DO CABLOCO
            operator,
            route,
            pointsOfSale,
            income,
            givenPrizesCount,
            chartData1,
            chartData2,
            machines,
        };
    }
};
DetailRouteService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('RoutesRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(3, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(4, tsyringe_1.inject('MachinesRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], DetailRouteService);
exports.default = DetailRouteService;

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
const collections_repository_1 = __importDefault(require("../../../collections/contracts/repositories/collections.repository"));
const couter_types_repository_1 = __importDefault(require("../../../counter-types/contracts/repositories/couter-types.repository"));
const period_dto_1 = __importDefault(require("../../contracts/dtos/period.dto"));
const machine_1 = __importDefault(require("../../contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../contracts/repositories/machines.repository"));
const telemetry_log_1 = __importDefault(require("../../../telemetry-logs/contracts/entities/telemetry-log"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
let GetMachineDetailsService = class GetMachineDetailsService {
    constructor(usersRepository, machinesRepository, telemetryLogsRepository, collectionsRepository, counterTypesRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.collectionsRepository = collectionsRepository;
        this.counterTypesRepository = counterTypesRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, machineId, period, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        // TODO: VERIFICAR SE ELE É UM OPERADOR PARA LIMITAR ALGUMAS
        const machine = await this.machinesRepository.findOne({
            by: 'id',
            value: machineId,
            populate: ['telemetryBoard', 'operator', 'group', 'pointOfSale'],
        });
        if (!machine)
            throw app_error_1.default.machineNotFound;
        if (user.role === role_1.default.OWNER && machine.ownerId !== user.id)
            throw app_error_1.default.authorizationError;
        if (user.role === role_1.default.OPERATOR && machine.operatorId !== user.id)
            throw app_error_1.default.authorizationError;
        if (user.role === role_1.default.MANAGER && !user.groupIds?.includes(machine.groupId))
            throw app_error_1.default.authorizationError;
        // ? ULTIMA COLETA
        const lastCollection = (await this.collectionsRepository.findLastCollection(machineId))?.date;
        const telemetryLogs = await this.telemetryLogsRepository.find({
            filters: {
                machineId,
                maintenance: false,
                date: {
                    startDate: lastCollection,
                    endDate: new Date(Date.now()),
                },
            },
        });
        const endDate = new Date(Date.now());
        let startDate;
        if (period === period_dto_1.default.DAILY)
            startDate = date_fns_1.subDays(endDate, 1);
        if (period === period_dto_1.default.WEEKLY)
            startDate = date_fns_1.subWeeks(endDate, 1);
        if (period === period_dto_1.default.MONTHLY)
            startDate = date_fns_1.subMonths(endDate, 1);
        if (startDate === undefined)
            throw app_error_1.default.unknownError;
        const telemetryLogsOfPeriod = await this.telemetryLogsRepository.find({
            filters: {
                machineId,
                date: {
                    startDate,
                    endDate,
                },
                maintenance: false,
            },
        });
        const telemetryLogsOfPeriodIn = telemetryLogsOfPeriod.filter(telemetryLog => telemetryLog.type === 'IN');
        const telemetryLogsOfPeriodOut = telemetryLogsOfPeriod.filter(telemetryLog => telemetryLog.type === 'OUT');
        const telemetryLogsOut = telemetryLogs.filter(telemetryLog => telemetryLog.type === 'OUT');
        const counterTypes = await this.counterTypesRepository.find({
            ownerId: user.role === role_1.default.OWNER ? user.id : user.ownerId,
        });
        // ? ULTIMA COMUNICAÇÃO
        const lastConnection = telemetryLogs[0]?.date
            ? telemetryLogs[0].date
            : undefined;
        // ? FATURAMENTO
        const income = telemetryLogsOfPeriodIn.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
        // ? PREMIOS ENTREGUES
        const givenPrizes = telemetryLogsOfPeriodOut.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
        // ? PREMIOS DISPONIVEIS POR GABINE
        const boxesInfo = machine.boxes.map(boxe => {
            // * INFORMAÇÃO DE UMA GABINE
            let givenPrizesCount = 0;
            boxe.counters.forEach(counter => {
                const counterType = counterTypes.find(counterType => counterType.id === counter.counterTypeId)?.type;
                if (counterType === 'OUT') {
                    const counterLogs = telemetryLogsOut.filter(telemetryLog => {
                        return (telemetryLog.pin?.toString() === counter.pin?.replace('Pino ', ''));
                    });
                    givenPrizesCount += counterLogs.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                }
            });
            return {
                boxId: boxe.id,
                givenPrizes: givenPrizesCount,
                currentMoney: boxe.currentMoney,
                currentPrizeCount: boxe.numberOfPrizes,
            };
        });
        let chartData = [];
        // ? CHART DATA PARA O PERIODO DIARIO
        if (period === period_dto_1.default.DAILY) {
            const hoursOfInterval = date_fns_1.eachHourOfInterval({
                start: startDate,
                end: endDate,
            });
            chartData = hoursOfInterval.map(hour => {
                const incomeInHour = telemetryLogsOfPeriodIn
                    .filter(telemetry => date_fns_1.isSameHour(hour, telemetry.date))
                    .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                const prizesCountInHour = telemetryLogsOfPeriodOut
                    .filter(telemetry => date_fns_1.isSameHour(hour, telemetry.date))
                    .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                return {
                    date: hour.toISOString(),
                    prizeCount: prizesCountInHour,
                    income: incomeInHour,
                };
            });
        }
        // ? CHART DATA PARA PERIODO SEMANAL E MENSAL
        if (period === period_dto_1.default.MONTHLY || period === period_dto_1.default.WEEKLY) {
            const daysOfInterval = date_fns_1.eachDayOfInterval({
                start: startDate,
                end: endDate,
            });
            chartData = daysOfInterval.map(day => {
                const incomeInDay = telemetryLogsOfPeriodIn
                    .filter(telemetry => date_fns_1.isSameDay(day, telemetry.date))
                    .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                const prizesCountInDay = telemetryLogsOfPeriodOut
                    .filter(telemetry => date_fns_1.isSameDay(day, telemetry.date))
                    .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                return {
                    date: day.toISOString(),
                    prizeCount: prizesCountInDay,
                    income: incomeInDay,
                };
            });
        }
        // ? HISTORICO DE EVENTOS
        const transactionHistory = await this.telemetryLogsRepository.find({
            filters: {},
            limit: 5,
        });
        return {
            machine,
            income,
            lastCollection,
            lastConnection,
            boxesInfo,
            givenPrizes,
            chartData,
            transactionHistory,
        };
    }
};
GetMachineDetailsService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(3, tsyringe_1.inject('CollectionsRepository')),
    __param(4, tsyringe_1.inject('CounterTypesRepository')),
    __param(5, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], GetMachineDetailsService);
exports.default = GetMachineDetailsService;

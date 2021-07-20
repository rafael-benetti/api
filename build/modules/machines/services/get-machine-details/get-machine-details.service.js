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
const machine_log_1 = __importDefault(require("../../../machine-logs/contracts/entities/machine-log"));
const machine_logs_repository_1 = __importDefault(require("../../../machine-logs/contracts/repositories/machine-logs.repository"));
const period_dto_1 = __importDefault(require("../../contracts/dtos/period.dto"));
const machine_1 = __importDefault(require("../../contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../contracts/repositories/machines.repository"));
const telemetry_log_1 = __importDefault(require("../../../telemetry-logs/contracts/entities/telemetry-log"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const bluebird_1 = require("bluebird");
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
let GetMachineDetailsService = class GetMachineDetailsService {
    constructor(usersRepository, machinesRepository, telemetryLogsRepository, collectionsRepository, counterTypesRepository, machineLogsRepository) {
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.collectionsRepository = collectionsRepository;
        this.counterTypesRepository = counterTypesRepository;
        this.machineLogsRepository = machineLogsRepository;
    }
    async execute({ userId, machineId, period, startDate, endDate, }) {
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
        const lastCollectionData = await this.collectionsRepository.findLastCollection(machineId);
        let lastCollection;
        let collectedBy;
        if (lastCollectionData) {
            lastCollection = lastCollectionData?.date;
            collectedBy = (await this.usersRepository.findOne({
                by: 'id',
                value: lastCollectionData?.userId,
            }))?.name;
        }
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
        const machineIncomePerDayPromise = this.telemetryLogsRepository.getMachineIncomePerDay({
            machineId,
            endDate,
            startDate,
            groupIds: [machine.groupId],
            withHours: period === period_dto_1.default.DAILY,
        });
        const machineGivenPrizesPerDayPromise = this.telemetryLogsRepository.getMachineGivenPrizesPerDay({
            machineId,
            endDate,
            startDate,
            groupIds: [machine.groupId],
            withHours: period === period_dto_1.default.DAILY,
        });
        const machineGivenPrizesPerPinPromise = this.telemetryLogsRepository.getMachineGivenPrizesPerDay({
            machineId,
            startDate: lastCollection,
            endDate: new Date(),
            groupIds: [machine.groupId],
            withHours: false,
        });
        // ? HISTORICO DE JOGADAS
        const transactionHistoryPromise = await this.telemetryLogsRepository.find({
            filters: {
                machineId,
                groupId: machine.groupId,
            },
            limit: 5,
        });
        // ? HISTORICO DE EVENTOS
        const machineLogsPromise = this.machineLogsRepository.find({
            machineId,
            limit: 5,
            offset: 0,
            groupId: machine.groupId,
            populate: ['user'],
            fields: [
                'user.name',
                'id',
                'machineId',
                'groupId',
                'observations',
                'type',
                'createdAt',
                'createdBy',
                'quantity',
            ],
        });
        const [machineIncomePerDay, machineGivenPrizesPerDay, machineLogs, transactionHistory, machineGivenPrizesPerPin,] = await bluebird_1.Promise.all([
            machineIncomePerDayPromise,
            machineGivenPrizesPerDayPromise,
            machineLogsPromise,
            transactionHistoryPromise,
            machineGivenPrizesPerPinPromise,
        ]);
        const counterTypes = await this.counterTypesRepository.find({
            ownerId: user.role === role_1.default.OWNER ? user.id : user.ownerId,
        });
        // ? ULTIMA COMUNICAÇÃO
        const { lastConnection } = machine;
        // ? FATURAMENTO
        const income = machineIncomePerDay.reduce((a, b) => a + b.income, 0);
        // ? PREMIOS ENTREGUES
        const givenPrizes = machineGivenPrizesPerDay.reduce((a, b) => a + b.givenPrizes, 0);
        // ? PREMIOS DISPONIVEIS POR GABINE
        const boxesInfo = machine.boxes.map(boxe => {
            // * INFORMAÇÃO DE UMA GABINE
            let givenPrizesCount = 0;
            boxe.counters.forEach(counter => {
                const counterType = counterTypes.find(counterType => counterType.id === counter.counterTypeId)?.type;
                if (counterType === 'OUT') {
                    givenPrizesCount = machineGivenPrizesPerPin
                        .filter(givenPrizeOfDay => {
                        return (givenPrizeOfDay.id.pin?.toString() ===
                            counter.pin?.replace('Pino ', ''));
                    })
                        .reduce((a, b) => a + b.givenPrizes, 0);
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
        if (period && period === period_dto_1.default.DAILY) {
            const hoursOfInterval = date_fns_1.eachHourOfInterval({
                start: startDate,
                end: endDate,
            });
            chartData = hoursOfInterval.map(hour => {
                const incomeInHour = machineIncomePerDay.find(telemetry => date_fns_1.isSameHour(hour, new Date(telemetry.id)))?.income || 0;
                const prizesCountInHour = machineGivenPrizesPerDay.find(telemetry => date_fns_1.isSameHour(hour, new Date(telemetry.id.date)))?.givenPrizes || 0;
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
                end: endDate,
            }).map(day => date_fns_1.addHours(day, 4));
            chartData = daysOfInterval.map(day => {
                const incomeInDay = machineIncomePerDay.find(telemetry => date_fns_1.isSameDay(day, new Date(telemetry.id).setUTCHours(3)))?.income || 0;
                const prizesCountInDay = machineGivenPrizesPerDay.find(telemetry => date_fns_1.isSameDay(day, new Date(telemetry.id.date).setUTCHours(3)))?.givenPrizes || 0;
                return {
                    date: day.toISOString(),
                    prizeCount: prizesCountInDay,
                    income: incomeInDay,
                };
            });
        }
        return {
            machine,
            income,
            lastCollection,
            lastConnection,
            boxesInfo,
            givenPrizes,
            chartData,
            transactionHistory,
            machineLogs,
            collectedBy,
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
    __param(5, tsyringe_1.inject('MachineLogsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], GetMachineDetailsService);
exports.default = GetMachineDetailsService;

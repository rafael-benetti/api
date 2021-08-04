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
const type_1 = __importDefault(require("../../../counter-types/contracts/enums/type"));
const couter_types_repository_1 = __importDefault(require("../../../counter-types/contracts/repositories/couter-types.repository"));
const machine_1 = __importDefault(require("../../../machines/contracts/models/machine"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("../../../../config/logger"));
const export_collections_report_1 = __importDefault(require("./export-collections-report"));
let GenerateCollectionsReportService = class GenerateCollectionsReportService {
    constructor(usersRepository, collectionsRepository, pointsOfSaleRepository, counterTypesRepository) {
        this.usersRepository = usersRepository;
        this.collectionsRepository = collectionsRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.counterTypesRepository = counterTypesRepository;
    }
    async execute({ userId, pointOfSaleId, startDate, endDate, download, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && !user.permissions?.generateReports)
            throw app_error_1.default.authorizationError;
        const pointOfSale = await this.pointsOfSaleRepository.findOne({
            by: 'id',
            value: pointOfSaleId,
        });
        if (!pointOfSale)
            throw app_error_1.default.pointOfSaleNotFound;
        const groupIds = await get_group_universe_1.default(user);
        if (!groupIds.includes(pointOfSale.groupId))
            throw app_error_1.default.authorizationError;
        startDate = date_fns_1.startOfDay(startDate);
        endDate = date_fns_1.endOfDay(endDate);
        const { collections } = await this.collectionsRepository.find({
            pointOfSaleId,
            startDate,
            endDate,
        });
        logger_1.default.info(collections);
        const machines = [
            ...new Set(collections.map(collection => collection.machine)),
        ];
        const counterTypes = await this.counterTypesRepository.find({
            ownerId: user.role === role_1.default.OWNER ? user.id : user.ownerId,
        });
        const machineReport = machines.map(machine => {
            const machineCollections = collections.filter(collection => collection.machineId === machine.id);
            const initialMechanicalCountIn = machineCollections[machineCollections.length - 1].boxCollections
                .map(boxCollection => boxCollection.counterCollections.reduce((a, b) => counterTypes.find(counterType => counterType.label === b.counterTypeLabel)?.type === type_1.default.IN
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : a + 0, 0))
                .reduce((a, b) => a + b, 0);
            const finalMechanicalCountIn = machineCollections[0].boxCollections
                .map(boxCollection => boxCollection.counterCollections.reduce((a, b) => counterTypes.find(counterType => counterType.label === b.counterTypeLabel)?.type === type_1.default.IN
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : a + 0, 0))
                .reduce((a, b) => a + b, 0);
            const mechanicalDiffenceIn = finalMechanicalCountIn - initialMechanicalCountIn;
            const initialMechanicalCountOut = machineCollections[machineCollections.length - 1].boxCollections
                .map(boxCollection => boxCollection.counterCollections.reduce((a, b) => counterTypes.find(counterType => counterType.label === b.counterTypeLabel)?.type === type_1.default.OUT
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : a + 0, 0))
                .reduce((a, b) => a + b, 0);
            const finalMechanicalCountOut = machineCollections[0].boxCollections
                .map(boxCollection => boxCollection.counterCollections.reduce((a, b) => counterTypes.find(counterType => counterType.label === b.counterTypeLabel)?.type === type_1.default.OUT
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : a + 0, 0))
                .reduce((a, b) => a + b, 0);
            const mechanicalDiffenceOut = finalMechanicalCountOut - initialMechanicalCountOut;
            const initialDigitalCountIn = machineCollections[machineCollections.length - 1].boxCollections
                .map(boxCollection => boxCollection.counterCollections.reduce((a, b) => counterTypes.find(counterType => counterType.label === b.counterTypeLabel)?.type === type_1.default.IN
                ? a + (b.digitalCount ? b.digitalCount : 0)
                : a + 0, 0))
                .reduce((a, b) => a + b, 0);
            const finalDigitalCountIn = machineCollections[0].boxCollections
                .map(boxCollection => boxCollection.counterCollections.reduce((a, b) => counterTypes.find(counterType => counterType.label === b.counterTypeLabel)?.type === type_1.default.IN
                ? a + (b.digitalCount ? b.digitalCount : 0)
                : a + 0, 0))
                .reduce((a, b) => a + b, 0);
            const digitalDiffenceIn = finalDigitalCountIn - initialDigitalCountIn;
            const initialDigitalCountOut = machineCollections[machineCollections.length - 1].boxCollections
                .map(boxCollection => boxCollection.counterCollections.reduce((a, b) => counterTypes.find(counterType => counterType.label === b.counterTypeLabel)?.type === type_1.default.OUT
                ? a + (b.digitalCount ? b.digitalCount : 0)
                : a + 0, 0))
                .reduce((a, b) => a + b, 0);
            const finalDigitalCountOut = machineCollections[0].boxCollections
                .map(boxCollection => boxCollection.counterCollections.reduce((a, b) => counterTypes.find(counterType => counterType.label === b.counterTypeLabel)?.type === type_1.default.OUT
                ? a + (b.digitalCount ? b.digitalCount : 0)
                : a + 0, 0))
                .reduce((a, b) => a + b, 0);
            const userCount = machineCollections
                .map(machineCollection => machineCollection.boxCollections
                .map(boxCollection => boxCollection.counterCollections.reduce((a, b) => counterTypes.find(counterType => counterType.label === b.counterTypeLabel)?.type === type_1.default.IN
                ? a + (b.userCount ? b.userCount : 0)
                : a + 0, 0))
                .reduce((a, b) => a + b, 0))
                .reduce((a, b) => a + b, 0);
            const digitalDiffenceOut = finalDigitalCountOut - initialDigitalCountOut;
            const initialDate = machineCollections[machineCollections.length - 1].date;
            const finalDate = machineCollections[0].date;
            const numberOfDays = date_fns_1.differenceInDays(finalDate, initialDate);
            return {
                serialNumber: machine.serialNumber,
                initialDate,
                finalDate,
                initialMechanicalCountIn,
                finalMechanicalCountIn,
                mechanicalDiffenceIn,
                initialMechanicalCountOut,
                finalMechanicalCountOut,
                mechanicalDiffenceOut,
                initialDigitalCountIn,
                finalDigitalCountIn,
                digitalDiffenceIn,
                initialDigitalCountOut,
                finalDigitalCountOut,
                digitalDiffenceOut,
                numberOfDays,
                userCount,
            };
        });
        if (download) {
            const Workbook = await export_collections_report_1.default({
                pointOfSale,
                collectionsAnalytics: machineReport,
                date: {
                    startDate,
                    endDate,
                },
            });
            return Workbook;
        }
        return machineReport;
    }
};
GenerateCollectionsReportService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('CollectionsRepository')),
    __param(2, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(3, tsyringe_1.inject('CounterTypesRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GenerateCollectionsReportService);
exports.default = GenerateCollectionsReportService;

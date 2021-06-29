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
/* eslint-disable @typescript-eslint/no-explicit-any */
const logger_1 = __importDefault(require("../../../../config/logger"));
const collection_1 = __importDefault(require("../../contracts/entities/collection"));
const collections_repository_1 = __importDefault(require("../../contracts/repositories/collections.repository"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const routes_repository_1 = __importDefault(require("../../../routes/contracts/repositories/routes.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const photo_1 = __importDefault(require("../../../users/contracts/models/photo"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const storage_provider_1 = __importDefault(require("../../../../providers/storage-provider/contracts/models/storage.provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const is_in_group_universe_1 = __importDefault(require("../../../../shared/utils/is-in-group-universe"));
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
const geolocation_dto_1 = __importDefault(require("../../contracts/dtos/geolocation.dto"));
let CreateCollectionService = class CreateCollectionService {
    constructor(usersRepository, machinesRepository, routesRepository, storageProvider, telemetryLogsRepository, pointsOfSaleRepository, collectionsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.routesRepository = routesRepository;
        this.storageProvider = storageProvider;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.collectionsRepository = collectionsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, machineId, observations, boxCollections, files, startTime, endLocation, startLocation, }) {
        const parsedFiles = {};
        files?.forEach(file => {
            const [boxId, counterId] = file.fieldname.split(':');
            if (!boxId || !counterId)
                throw app_error_1.default.incorrectFilters;
            if (!parsedFiles[boxId])
                parsedFiles[boxId] = {};
            if (!parsedFiles[boxId][counterId])
                parsedFiles[boxId][counterId] = [];
            parsedFiles[boxId][counterId].push(file);
        });
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const machine = await this.machinesRepository.findOne({
            by: 'id',
            value: machineId,
        });
        if (!machine)
            throw app_error_1.default.machineNotFound;
        if (!machine.telemetryBoardId)
            throw app_error_1.default.telemetryBoardNotFound;
        if (!machine.lastConnection)
            throw app_error_1.default.thisMachineIsOffline;
        if (date_fns_1.isBefore(machine.lastConnection, date_fns_1.subMinutes(new Date(Date.now()), 10)))
            throw app_error_1.default.thisMachineIsOffline;
        if (!machine.locationId)
            throw app_error_1.default.productInStock;
        const location = await this.pointsOfSaleRepository.findOne({
            by: 'id',
            value: machine.locationId,
        });
        if (!location)
            throw app_error_1.default.productInStock;
        if (user.role === role_1.default.OPERATOR && machine.operatorId !== user.id)
            throw app_error_1.default.authorizationError;
        const universe = await get_group_universe_1.default(user);
        if (!is_in_group_universe_1.default({
            universe,
            groups: [machine.groupId],
            method: 'INTERSECTION',
        }))
            throw app_error_1.default.authorizationError;
        const route = await this.routesRepository.findOne({
            pointsOfSaleId: machine.locationId,
        });
        const previousCollection = await this.collectionsRepository.findLastCollection(machineId);
        const telemetryLogs = await this.telemetryLogsRepository.find({
            filters: {
                date: {
                    startDate: previousCollection?.date,
                    endDate: new Date(),
                },
                machineId,
                maintenance: false,
            },
        });
        logger_1.default.info(telemetryLogs);
        await Promise.all(boxCollections.map(async (boxCollection) => {
            const box = machine.boxes.find(box => box.id === boxCollection.boxId);
            if (!box)
                throw app_error_1.default.boxNotFound;
            if (boxCollection.prizeCount !== undefined &&
                (user.role === role_1.default.OWNER || user.permissions?.fixMachineStock)) {
                box.numberOfPrizes = boxCollection.prizeCount;
            }
            box.currentMoney = 0;
            await Promise.all(boxCollection.counterCollections.map(async (counterCollection) => {
                const counter = box.counters.find(counter => counter.id === counterCollection.counterId);
                if (!counter)
                    throw app_error_1.default.counterNotFound;
                counterCollection.telemetryCount = telemetryLogs
                    .filter(telemetryLog => telemetryLog.pin?.toString() ===
                    counter.pin?.split(' ')[1].toString())
                    .map(log => log.value)
                    .reduce((a, b) => a + b, 0);
                if (files && files.length > 0) {
                    if (parsedFiles[box.id] && parsedFiles[box.id][counter.id])
                        await Promise.all(parsedFiles[box.id][counter.id].map(async (file) => {
                            const photo = await this.storageProvider.uploadFile(file);
                            if (!counterCollection.photos)
                                counterCollection.photos = [];
                            counterCollection.photos.push(photo);
                        }));
                }
            }));
        }));
        const collection = this.collectionsRepository.create({
            previousCollectionId: previousCollection?.id,
            machineId,
            groupId: machine.groupId,
            userId,
            pointOfSaleId: machine.locationId,
            routeId: route?.id,
            observations,
            boxCollections,
            startTime,
            endLocation,
            startLocation,
        });
        machine.lastCollection = collection.date;
        this.collectionsRepository.save(collection);
        this.machinesRepository.save(machine);
        await this.ormProvider.commit();
        Object.assign(collection, {
            machine,
            user,
            pointOfSale: location,
            previousCollection,
        });
        return collection;
    }
};
CreateCollectionService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('RoutesRepository')),
    __param(3, tsyringe_1.inject('StorageProvider')),
    __param(4, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(5, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(6, tsyringe_1.inject('CollectionsRepository')),
    __param(7, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], CreateCollectionService);
exports.default = CreateCollectionService;

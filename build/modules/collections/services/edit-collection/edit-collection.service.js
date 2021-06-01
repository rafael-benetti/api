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
const collection_1 = __importDefault(require("../../contracts/entities/collection"));
const collections_repository_1 = __importDefault(require("../../contracts/repositories/collections.repository"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const photo_1 = __importDefault(require("../../../users/contracts/models/photo"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const storage_provider_1 = __importDefault(require("../../../../providers/storage-provider/contracts/models/storage.provider"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("../../../../config/logger"));
let EditCollectionService = class EditCollectionService {
    constructor(collectionsRepository, usersRepository, telemetryLogsRepository, machinesRepository, pointsOfSaleRepository, ormProvider, storageProvider) {
        this.collectionsRepository = collectionsRepository;
        this.usersRepository = usersRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.machinesRepository = machinesRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.ormProvider = ormProvider;
        this.storageProvider = storageProvider;
    }
    async execute({ userId, collectionId, machineId, files, photosToDelete, boxCollections, observations, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.MANAGER &&
            user.role !== role_1.default.OWNER &&
            user.role !== role_1.default.OPERATOR)
            throw app_error_1.default.authorizationError;
        if (user.role === role_1.default.OPERATOR) {
            if (!user.permissions?.editCollections)
                throw app_error_1.default.authorizationError;
        }
        const lastCollection = await this.collectionsRepository.findLastCollection(machineId);
        if (!lastCollection)
            throw app_error_1.default.collectionNotFound;
        if (lastCollection.id !== collectionId)
            throw app_error_1.default.thisIsNotLastCollection;
        const machine = await this.machinesRepository.findOne({
            by: 'id',
            value: machineId,
        });
        if (!machine)
            throw app_error_1.default.machineNotFound;
        if (!machine.locationId)
            throw app_error_1.default.machineInStock;
        const location = await this.pointsOfSaleRepository.findOne({
            by: 'id',
            value: machine.locationId,
        });
        if (!location)
            throw app_error_1.default.pointOfSaleNotFound;
        if (user.role === role_1.default.OPERATOR && machine.operatorId !== user.id)
            throw app_error_1.default.authorizationError;
        if (!user.groupIds?.includes(lastCollection.groupId) &&
            user.role !== role_1.default.OWNER)
            throw app_error_1.default.authorizationError;
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
        // ? REMOVE FOTOS
        if (photosToDelete && photosToDelete.length > 0) {
            lastCollection.boxCollections.forEach(boxCollections => {
                boxCollections.counterCollections.forEach(counterCollection => {
                    for (let i = 0; i < counterCollection.photos?.length; i += 1) {
                        const obj = counterCollection.photos[i];
                        if (photosToDelete.indexOf(obj.key) !== -1) {
                            counterCollection.photos.splice(i, 1);
                            this.storageProvider.deleteFile(obj.key);
                            i -= 1;
                        }
                    }
                });
            });
        }
        let previousCollection;
        if (lastCollection.previousCollectionId)
            previousCollection = await this.collectionsRepository.findOne(lastCollection.previousCollectionId);
        const { telemetryLogs } = await this.telemetryLogsRepository.find({
            filters: {
                date: {
                    startDate: previousCollection?.date,
                    endDate: lastCollection.date,
                },
                machineId,
                maintenance: false,
                type: 'IN',
            },
        });
        await Promise.all(boxCollections.map(async (boxCollection) => {
            const box = machine.boxes.find(box => box.id === boxCollection.boxId);
            if (!box)
                throw app_error_1.default.boxNotFound;
            await Promise.all(boxCollection.counterCollections.map(async (counterCollection) => {
                const counter = box.counters.find(counter => counter.id === counterCollection.counterId);
                if (!counter)
                    throw app_error_1.default.counterNotFound;
                counterCollection.telemetryCount = telemetryLogs
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
        lastCollection.boxCollections.forEach(lastBoxCollection => {
            lastBoxCollection.counterCollections.forEach(lastCounterCollection => {
                boxCollections.forEach(boxCollection => {
                    if (boxCollection.boxId === lastBoxCollection.boxId) {
                        boxCollection.counterCollections.forEach(counterCollection => {
                            if (counterCollection.counterId === lastCounterCollection.counterId) {
                                logger_1.default.info('counterCollection.photoscounterCollection.photoscounterCollection.photoscounterCollection.photoscounterCollection.photos');
                                logger_1.default.info(lastCounterCollection.photos);
                                counterCollection.photos = [
                                    ...(counterCollection.photos ?? []),
                                    ...(lastCounterCollection.photos ?? []),
                                ];
                            }
                        });
                    }
                });
            });
        });
        lastCollection.boxCollections = boxCollections;
        lastCollection.observations = observations;
        this.machinesRepository.save(machine);
        await this.ormProvider.commit();
        this.collectionsRepository.save(lastCollection);
        await this.ormProvider.commit();
        Object.assign(lastCollection, {
            machine,
            user,
            pointOfSale: location,
            previousCollection,
        });
        return lastCollection;
    }
};
EditCollectionService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('CollectionsRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(3, tsyringe_1.inject('MachinesRepository')),
    __param(4, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(5, tsyringe_1.inject('OrmProvider')),
    __param(6, tsyringe_1.inject('StorageProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], EditCollectionService);
exports.default = EditCollectionService;

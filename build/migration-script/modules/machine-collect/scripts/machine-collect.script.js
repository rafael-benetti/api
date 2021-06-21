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
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const tsyringe_1 = require("tsyringe");
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const ioredis_1 = __importDefault(require("ioredis"));
const collections_repository_1 = __importDefault(require("../../../../modules/collections/contracts/repositories/collections.repository"));
const counter_collection_1 = __importDefault(require("../../../../modules/collections/contracts/interfaces/counter-collection"));
const couter_types_repository_1 = __importDefault(require("../../../../modules/counter-types/contracts/repositories/couter-types.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const logger_1 = __importDefault(require("../../../../config/logger"));
const machines_repository_1 = __importDefault(require("../../../../modules/machines/contracts/repositories/machines.repository"));
const box_collection_1 = __importDefault(require("../../../../modules/collections/contracts/interfaces/box-collection"));
const storage_provider_1 = __importDefault(require("../../../../providers/storage-provider/contracts/models/storage.provider"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const telemetry_logs_repository_1 = __importDefault(require("../../../../modules/telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const type_machine_collect_repository_1 = __importDefault(require("../typeorm/repositories/type-machine-collect-repository"));
let MachineCollectScript = class MachineCollectScript {
    constructor(typeMachineCollectRepository, collectionsRepository, counterTypesRepository, machinesRepository, storageProvider, telemetryLogsRepository, ormProvider) {
        this.typeMachineCollectRepository = typeMachineCollectRepository;
        this.collectionsRepository = collectionsRepository;
        this.counterTypesRepository = counterTypesRepository;
        this.machinesRepository = machinesRepository;
        this.storageProvider = storageProvider;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.ormProvider = ormProvider;
        this.client = new ioredis_1.default();
    }
    async execute() {
        this.ormProvider.clear();
        const machineCollects = await this.typeMachineCollectRepository.find();
        for (const machineCollect of machineCollects) {
            try {
                const machineId = (await this.client.get(`@machines:${machineCollect.machineId}`));
                const machine = await this.machinesRepository.findOne({
                    by: 'id',
                    value: machineId,
                });
                // eslint-disable-next-line no-loop-func
                const countersCollect = [];
                let boxCollections = [];
                for (const counter of machineCollect.counters) {
                    const counterId = (await this.client.get(`@counters:@machineId:${machineCollect.machineId}:@counterId:${counter.counterId}`));
                    let counterTypeId;
                    machine?.boxes.forEach(box => {
                        if (counterTypeId === undefined) {
                            counterTypeId = box.counters.find(counter => counter.id === counterId)?.counterTypeId;
                        }
                    });
                    if (!counterTypeId) {
                        machine?.boxes.forEach(box => {
                            logger_1.default.info(box.counters);
                        });
                    }
                    const counterTypeLabel = (await this.counterTypesRepository.findOne({
                        id: counterTypeId,
                    }))?.label;
                    if (!counterTypeLabel)
                        throw app_error_1.default.counterTypeNotFound;
                    const counterCollection = {
                        counterId,
                        counterTypeLabel,
                        digitalCount: counter.isDigital ? counter.quantity : 0,
                        mechanicalCount: counter.isMechanical ? counter.quantity : 0,
                        userCount: counter.isCounted ? counter.quantity : 0,
                        photos: counter.photos.map(photo => {
                            return { key: photo.photo, downloadUrl: photo.photo };
                        }),
                        telemetryCount: 0,
                    };
                    const counterGroup = (await this.client.get(`@boxes:@machineId:${machineCollect.machineId}:@counterId:${counter.counterId}`));
                    const boxId = (await this.client.get(`@boxes:${counterGroup}`));
                    countersCollect.push({
                        boxId,
                        counterCollection,
                    });
                    const boxesIds = [
                        ...new Set(countersCollect.map(counterCollect => counterCollect.boxId)),
                    ];
                    boxCollections = boxesIds.map(boxId => {
                        const temp = countersCollect
                            .filter(counterCollect => counterCollect.boxId === boxId)
                            .map(cc => {
                            return {
                                counterId: cc.counterCollection.counterId,
                                counterTypeLabel: cc.counterCollection.counterTypeLabel,
                                digitalCount: cc.counterCollection.digitalCount,
                                mechanicalCount: cc.counterCollection.mechanicalCount,
                                photos: [...cc.counterCollection.photos],
                                telemetryCount: cc.counterCollection.telemetryCount,
                                userCount: cc.counterCollection.userCount,
                            };
                        });
                        const counterCollections = [];
                        temp.forEach(cc => {
                            if (counterCollections.find(cc2 => cc.counterId === cc2.counterId)) {
                                const ccIndex = counterCollections.findIndex(cc2 => cc.counterId === cc2.counterId);
                                counterCollections[ccIndex].photos = [
                                    ...counterCollections[ccIndex].photos,
                                    ...cc.photos,
                                ];
                                counterCollections[ccIndex].digitalCount += cc.digitalCount;
                                counterCollections[ccIndex].mechanicalCount +=
                                    cc.mechanicalCount;
                                if (counterCollections[ccIndex]?.userCount) {
                                    if (cc.userCount) {
                                        const troxa = counterCollections[ccIndex].userCount || 0;
                                        counterCollections[ccIndex].userCount =
                                            troxa + cc.userCount;
                                    }
                                }
                                else {
                                    counterCollections[ccIndex].userCount = cc.userCount;
                                }
                            }
                            else {
                                counterCollections.push(cc);
                            }
                        });
                        return {
                            boxId,
                            counterCollections,
                        };
                    });
                }
                const userId = (await this.client.get(`@users:${machineCollect.userId}`));
                for (const boxCollection of boxCollections) {
                    for (const counterCollection of boxCollection.counterCollections) {
                        for (const photo1 of counterCollection.photos) {
                            const filePath = path_1.default.join(process.cwd(), 'optimized', photo1.key);
                            logger_1.default.info(filePath);
                            const f = fs_1.default.readFileSync(filePath);
                            const photo = await this.storageProvider.uploadFile(f);
                            const index = counterCollection.photos.findIndex(ccc => ccc.key === photo1.key);
                            counterCollection.photos[index] = photo;
                        }
                    }
                }
                if (machine?.groupId) {
                    const collection = this.collectionsRepository.create({
                        boxCollections,
                        groupId: machine?.groupId,
                        machineId,
                        observations: '',
                        pointOfSaleId: undefined,
                        startTime: machineCollect.collectionDate,
                        date: machineCollect.collectionDate,
                        userId,
                        previousCollectionId: machineCollect.previousCollectionId?.toString(),
                    });
                    this.collectionsRepository.save(collection);
                    await this.ormProvider.commit();
                    await this.client.set(`@collections:${machineCollect.id}`, collection.id);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    async setPreviousCollection() {
        this.ormProvider.clear();
        const { collections } = await this.collectionsRepository.find({});
        for (const collection of collections) {
            const previousCollectionId = await this.client.get(`@collections:${collection.previousCollectionId}`);
            collection.previousCollectionId = previousCollectionId || undefined;
            logger_1.default.info(previousCollectionId);
            let previousCollection;
            if (previousCollectionId) {
                previousCollection = await this.collectionsRepository.findOne(previousCollectionId);
            }
            const telemetryLogsIn = await this.telemetryLogsRepository.find({
                filters: {
                    date: {
                        startDate: previousCollection?.date,
                        endDate: collection.date,
                    },
                    machineId: collection.machineId,
                    maintenance: false,
                    type: 'IN',
                },
            });
            const telemetryLogsOut = await this.telemetryLogsRepository.find({
                filters: {
                    date: {
                        startDate: previousCollection?.date,
                        endDate: collection.date,
                    },
                    machineId: collection.machineId,
                    maintenance: false,
                    type: 'OUT',
                },
            });
            const machine = await this.machinesRepository.findOne({
                by: 'id',
                value: collection.machineId,
            });
            for (const bb of collection.boxCollections) {
                for (const cc of bb.counterCollections) {
                    let pin;
                    let counterTypeId;
                    machine?.boxes.forEach(box => box.counters.forEach(counter => {
                        if (counter.id === cc.counterId) {
                            pin = counter.pin;
                            counterTypeId = counter.counterTypeId;
                        }
                    }));
                    const counterType = await this.counterTypesRepository.findOne({
                        id: counterTypeId,
                    });
                    if (counterType?.type === 'IN') {
                        const telemetryCount = telemetryLogsIn
                            .filter(telemetryLog => telemetryLog.pin?.toString() === pin?.split(' ')[1])
                            .reduce((a, b) => a + b.value, 0);
                        const ccIndex = bb.counterCollections.findIndex(cc2 => cc.counterId === cc2.counterId);
                        bb.counterCollections[ccIndex].telemetryCount = telemetryCount;
                    }
                    if (counterType?.type === 'OUT') {
                        const telemetryCount = telemetryLogsOut
                            .filter(telemetryLog => telemetryLog.pin?.toString() === pin?.split(' ')[1])
                            .reduce((a, b) => a + b.value, 0);
                        const ccIndex = bb.counterCollections.findIndex(cc2 => cc.counterId === cc2.counterId);
                        bb.counterCollections[ccIndex].telemetryCount = telemetryCount;
                    }
                }
            }
            this.collectionsRepository.save(collection);
            await this.ormProvider.commit();
            await this.ormProvider.clear();
        }
    }
};
MachineCollectScript = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TypeMachineCollectRepository')),
    __param(1, tsyringe_1.inject('CollectionsRepository')),
    __param(2, tsyringe_1.inject('CounterTypesRepository')),
    __param(3, tsyringe_1.inject('MachinesRepository')),
    __param(4, tsyringe_1.inject('StorageProvider')),
    __param(5, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(6, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [type_machine_collect_repository_1.default, Object, Object, Object, Object, Object, Object])
], MachineCollectScript);
exports.default = MachineCollectScript;

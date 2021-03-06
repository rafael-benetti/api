"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_machine_dto_1 = __importDefault(require("../../../contracts/dtos/create-machine.dto"));
const find_machine_dto_1 = __importDefault(require("../../../contracts/dtos/find-machine.dto"));
const find_machines_dto_1 = __importDefault(require("../../../contracts/dtos/find-machines.dto"));
const machine_1 = __importDefault(require("../../../contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../../contracts/repositories/machines.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
const machine_mapper_1 = __importDefault(require("../mapper/machine.mapper"));
const mikro_machine_1 = __importDefault(require("../models/mikro-machine"));
class MikroMachinesRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_machine_1.default);
    }
    create(data) {
        const mikroMachine = new mikro_machine_1.default(data);
        this.repository.persist(mikroMachine);
        return machine_mapper_1.default.toEntity(mikroMachine);
    }
    async findOne(data) {
        const machine = await this.repository.findOne({
            [data.by]: data.value,
        }, {
            populate: data.populate,
        });
        return machine ? machine_mapper_1.default.toEntity(machine) : undefined;
    }
    async find({ id, ownerId, groupIds, operatorId, categoryId, pointOfSaleId, serialNumber, isActive, telemetryBoardId, telemetryStatus, limit, offset, populate, orderByLastCollection, orderByLastConnection, checkLastCollectionExists, fields, checkLocationExists, }) {
        const telemetryStatusQuery = {};
        const lastCollectionQuery = {};
        const lastConnectionQuery = {};
        if (orderByLastConnection && checkLastCollectionExists) {
            telemetryStatusQuery.lastConnection = {
                $exists: true,
                $ne: null,
            };
        }
        if (orderByLastCollection) {
            lastCollectionQuery.lastCollection = {
                $exists: true,
                $ne: null,
            };
        }
        if (telemetryStatus) {
            if (telemetryStatus === 'ONLINE') {
                telemetryStatusQuery.lastConnection = {
                    $gte: date_fns_1.addMinutes(new Date(), -10),
                };
            }
            if (telemetryStatus === 'OFFLINE') {
                telemetryStatusQuery.lastConnection = {
                    $lt: date_fns_1.addMinutes(new Date(), -10),
                };
            }
            if (telemetryStatus === 'VIRGIN') {
                telemetryStatusQuery.telemetryBoardId = {
                    $ne: null,
                };
                telemetryStatusQuery.lastConnection = null;
            }
            if (telemetryStatus === 'NO_TELEMETRY') {
                telemetryStatusQuery.telemetryBoardId = null;
            }
        }
        const result = await this.repository.find({
            ...(id && { id }),
            ...(operatorId && { operatorId }),
            ...(ownerId && { ownerId }),
            ...(groupIds && { groupId: groupIds }),
            ...(telemetryBoardId && { telemetryBoardId }),
            ...(categoryId && { categoryId }),
            ...(pointOfSaleId !== undefined && {
                locationId: pointOfSaleId === 'null' ? null : pointOfSaleId,
            }),
            ...(checkLocationExists && { locationId: { $ne: null } }),
            ...(serialNumber && {
                serialNumber: new RegExp(serialNumber, 'i'),
            }),
            ...(isActive !== undefined && { isActive }),
            ...telemetryStatusQuery,
            ...lastCollectionQuery,
            ...lastConnectionQuery,
        }, {
            ...(orderByLastCollection && {
                orderBy: {
                    lastCollection: 'ASC',
                },
            }),
            ...(orderByLastConnection && {
                orderBy: {
                    lastConnection: 'ASC',
                },
            }),
            limit,
            offset,
            fields,
            populate,
        });
        const machines = result.map(machine => machine_mapper_1.default.toEntity(machine));
        return machines;
    }
    async findAndCount({ id, ownerId, groupIds, operatorId, categoryId, pointOfSaleId, serialNumber, isActive, telemetryBoardId, telemetryStatus, limit, offset, populate, orderByLastCollection, orderByLastConnection, checkLastCollectionExists, fields, }) {
        const telemetryStatusQuery = {};
        const lastCollectionQuery = {};
        const lastConnectionQuery = {};
        if (orderByLastConnection && checkLastCollectionExists) {
            telemetryStatusQuery.lastConnection = {
                $exists: true,
                $ne: null,
            };
        }
        if (orderByLastCollection) {
            lastCollectionQuery.lastCollection = {
                $exists: true,
                $ne: null,
            };
        }
        if (telemetryStatus) {
            if (telemetryStatus === 'ONLINE') {
                telemetryStatusQuery.lastConnection = {
                    $gte: date_fns_1.addMinutes(new Date(), -10),
                };
            }
            if (telemetryStatus === 'OFFLINE') {
                telemetryStatusQuery.lastConnection = {
                    $lt: date_fns_1.addMinutes(new Date(), -10),
                };
            }
            if (telemetryStatus === 'VIRGIN') {
                telemetryStatusQuery.telemetryBoardId = {
                    $ne: null,
                };
                telemetryStatusQuery.lastConnection = null;
            }
            if (telemetryStatus === 'NO_TELEMETRY') {
                telemetryStatusQuery.telemetryBoardId = null;
            }
        }
        const [result, count] = await this.repository.findAndCount({
            ...(id && { id }),
            ...(operatorId && { operatorId }),
            ...(ownerId && { ownerId }),
            ...(groupIds && { groupId: groupIds }),
            ...(telemetryBoardId && { telemetryBoardId }),
            ...(categoryId && { categoryId }),
            ...(pointOfSaleId !== undefined && {
                locationId: pointOfSaleId === 'null' ? null : pointOfSaleId,
            }),
            ...(serialNumber && {
                serialNumber: new RegExp(serialNumber, 'i'),
            }),
            ...(isActive !== undefined && { isActive }),
            ...telemetryStatusQuery,
            ...lastCollectionQuery,
            ...lastConnectionQuery,
        }, {
            ...(orderByLastCollection && {
                orderBy: {
                    lastCollection: 'ASC',
                },
            }),
            ...(orderByLastConnection && {
                orderBy: {
                    lastConnection: 'ASC',
                },
            }),
            limit,
            offset,
            fields,
            populate,
        });
        const machines = result.map(machine => machine_mapper_1.default.toEntity(machine));
        return { machines, count };
    }
    async machineSortedByStock({ groupIds, operatorId, pointOfSaleId, }) {
        const stages = [
            {
                $match: {
                    locationId: {
                        $exists: true,
                        $ne: null,
                    },
                },
            },
            {
                $match: {
                    lastConnection: {
                        $exists: true,
                        $ne: null,
                    },
                },
            },
            {
                $match: {
                    minimumPrizeCount: {
                        $exists: true,
                        $ne: null,
                    },
                },
            },
            {
                $project: {
                    id: '$_id',
                    serialNumber: '$serialNumber',
                    minimumPrizeCount: '$minimumPrizeCount',
                    lastConnection: '$lastConnection',
                    categoryLabel: '$categoryLabel',
                    groupId: '$groupId',
                    priority: {
                        $subtract: [
                            { $sum: '$boxes.numberOfPrizes' },
                            '$minimumPrizeCount',
                        ],
                    },
                    total: {
                        $sum: '$boxes.numberOfPrizes',
                    },
                },
            },
            {
                $sort: {
                    priority: 1,
                },
            },
            {
                $limit: 5,
            },
        ];
        if (operatorId) {
            stages.unshift({
                $match: {
                    operatorId: { $eq: operatorId },
                },
            });
        }
        if (groupIds) {
            stages.unshift({
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                },
            });
        }
        if (pointOfSaleId) {
            stages.unshift({
                $match: {
                    locationId: {
                        $in: pointOfSaleId,
                    },
                },
            });
        }
        const machines = await this.repository.aggregate(stages);
        return machines;
    }
    async count({ ownerId, telemetryStatus, operatorId, groupIds, pointOfSaleId, checkLocationExists, }) {
        const telemetryStatusQuery = {};
        if (telemetryStatus) {
            if (telemetryStatus === 'ONLINE') {
                telemetryStatusQuery.lastConnection = {
                    $gte: date_fns_1.addMinutes(new Date(), -10),
                };
            }
            if (telemetryStatus === 'OFFLINE') {
                telemetryStatusQuery.lastConnection = {
                    $lt: date_fns_1.addMinutes(new Date(), -10),
                };
            }
            if (telemetryStatus === 'VIRGIN') {
                telemetryStatusQuery.telemetryBoardId = {
                    $ne: null,
                };
                telemetryStatusQuery.lastConnection = null;
            }
            if (telemetryStatus === 'NO_TELEMETRY') {
                telemetryStatusQuery.telemetryBoardId = null;
            }
        }
        const count = await this.repository.count({
            ...(ownerId && { ownerId }),
            ...(groupIds && { groupId: groupIds }),
            ...(operatorId && { operatorId }),
            ...(pointOfSaleId && { locationId: pointOfSaleId }),
            ...(checkLocationExists &&
                !pointOfSaleId && { locationId: { $ne: null } }),
            ...telemetryStatusQuery,
            isActive: true,
        });
        return count;
    }
    async machinePerCategory({ groupIds }) {
        const stages = [
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                },
            },
            {
                $group: {
                    _id: '$categoryLabel',
                    totalInStock: {
                        $sum: {
                            $cond: [{ $eq: ['$locationId', null] }, 1, 0],
                        },
                    },
                    totalInOperation: {
                        $sum: {
                            $cond: [{ $eq: ['$locationId', null] }, 0, 1],
                        },
                    },
                },
            },
            {
                $project: {
                    categoryLabel: '$_id',
                    _id: 0,
                    totalInStock: 1,
                    totalInOperation: 1,
                },
            },
        ];
        const response = await this.repository.aggregate(stages);
        return response;
    }
    async machinesInventoryByProduct({ groupIds }) {
        const stages = [
            {
                $match: {
                    groupId: {
                        $in: groupIds,
                    },
                },
            },
            {
                $group: {
                    _id: '$typeOfPrize',
                    arrayOfValues: {
                        $push: '$boxes.numberOfPrizes',
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $project: {
                    count: 1,
                    prizesArray: {
                        $reduce: {
                            input: {
                                $map: {
                                    input: '$arrayOfValues',
                                    in: '$$this',
                                },
                            },
                            initialValue: [],
                            in: { $concatArrays: ['$$value', '$$this'] },
                        },
                    },
                },
            },
            {
                $project: {
                    count: 1,
                    prizeId: '$_id.id',
                    prizeLabel: '$_id.label',
                    totalPrizes: {
                        $reduce: {
                            input: '$prizesArray',
                            initialValue: 0,
                            in: { $add: ['$$value', '$$this'] },
                        },
                    },
                    _id: 0,
                },
            },
        ];
        const response = await this.repository.aggregate(stages);
        return response;
    }
    save(data) {
        const reference = this.repository.getReference(data.id);
        const machine = this.repository.assign(reference, data);
        this.repository.persist(machine);
    }
}
exports.default = MikroMachinesRepository;

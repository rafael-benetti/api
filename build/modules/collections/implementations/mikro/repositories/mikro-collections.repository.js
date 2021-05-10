"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_collection_dto_1 = __importDefault(require("../../../contracts/dtos/create-collection.dto"));
const find_collections_dto_1 = __importDefault(require("../../../contracts/dtos/find-collections.dto"));
const collection_1 = __importDefault(require("../../../contracts/entities/collection"));
const collections_repository_1 = __importDefault(require("../../../contracts/repositories/collections.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const mikro_collection_1 = __importDefault(require("../entities/mikro-collection"));
const collections_mapper_1 = __importDefault(require("../mappers/collections.mapper"));
class MikroCollectionsRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_collection_1.default);
    }
    create(data) {
        const collection = new mikro_collection_1.default(data);
        return collections_mapper_1.default.map(collection);
    }
    async findOne(collectionId) {
        const collection = await this.repository.findOne({
            id: collectionId,
        });
        return collection ? collections_mapper_1.default.map(collection) : undefined;
    }
    async findLastCollection(machineId) {
        const collection = await this.repository.findOne({
            machineId,
        }, undefined, { date: 'DESC' });
        return collection ? collections_mapper_1.default.map(collection) : undefined;
    }
    async find(data) {
        const [collections, count] = await this.repository.findAndCount({
            groupId: {
                $in: data.groupIds,
            },
            ...(data.machineId && { machineId: data.machineId }),
        }, {
            limit: data.limit,
            orderBy: {
                date: 'DESC',
            },
            offset: data.offset,
            populate: [
                'machine',
                'previousCollection',
                'user',
                'group',
                'pointOfSale',
                'route',
            ],
            fields: [
                'machine',
                'previousCollection',
                'previousCollection.boxCollections',
                'previousCollection.date',
                'observations',
                'date',
                'boxCollections',
                'user',
                'user.name',
                'pointOfSale',
                'pointOfSale.label',
            ],
        });
        return {
            collections: collections.map(collection => collections_mapper_1.default.map(collection)),
            count,
        };
    }
    save(data) {
        const collection = collections_mapper_1.default.map(data);
        this.repository.persist(collection);
    }
}
exports.default = MikroCollectionsRepository;

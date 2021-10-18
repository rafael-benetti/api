"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_group_dto_1 = __importDefault(require("../../../contracts/dtos/create-group.dto"));
const find_group_dto_1 = __importDefault(require("../../../contracts/dtos/find-group.dto"));
const find_groups_dto_1 = __importDefault(require("../../../contracts/dtos/find-groups.dto"));
const group_1 = __importDefault(require("../../../contracts/models/group"));
const groups_repository_1 = __importDefault(require("../../../contracts/repositories/groups.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const group_mapper_1 = __importDefault(require("../models/group-mapper"));
const mikro_group_1 = __importDefault(require("../models/mikro-group"));
class MikroGroupsRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_group_1.default);
    }
    create(data) {
        const group = new mikro_group_1.default(data);
        this.repository.persist(group);
        return group_mapper_1.default.toApi(group);
    }
    async findOne(data) {
        const group = await this.repository.findOne({
            [data.by]: data.value,
        }, data.populate);
        return group ? group_mapper_1.default.toApi(group) : undefined;
    }
    async find(data) {
        const { ownerId, isPersonal, ids } = data.filters;
        const query = {};
        if (ownerId)
            query.ownerId = ownerId;
        if (isPersonal !== undefined)
            query.isPersonal = isPersonal;
        if (ids)
            query.id = ids;
        const groups = await this.repository.find({
            ...query,
        }, {
            limit: data.limit,
            offset: data.offset,
            populate: data.populate,
            ...(data.fields && { fields: data.fields }),
        });
        return groups.map(group => group_mapper_1.default.toApi(group));
    }
    async groupsInvertoryByProduct({ filters }) {
        const stages = [
            {
                $match: {
                    _id: {
                        $in: filters.ids,
                    },
                },
            },
            {
                $unwind: '$stock.prizes',
            },
            {
                $group: {
                    _id: {
                        id: '$stock.prizes.id',
                        label: '$stock.prizes.label',
                    },
                    totalPrizes: {
                        $sum: '$stock.prizes.quantity',
                    },
                },
            },
            {
                $project: {
                    prizeId: '$_id.id',
                    prizeLabel: '$_id.label',
                    totalPrizes: 1,
                    _id: 0,
                },
            },
        ];
        const response = await this.repository.aggregate(stages);
        return response;
    }
    async groupsInvertoryBySupplies({ filters }) {
        const stages = [
            {
                $match: {
                    _id: {
                        $in: filters.ids,
                    },
                },
            },
            {
                $unwind: '$stock.supplies',
            },
            {
                $group: {
                    _id: {
                        id: '$stock.supplies.id',
                        label: '$stock.supplies.label',
                    },
                    totalSupplies: {
                        $sum: '$stock.supplies.quantity',
                    },
                },
            },
            {
                $project: {
                    supplieId: '$_id.id',
                    supplieLabel: '$_id.label',
                    totalSupplies: 1,
                    _id: 0,
                },
            },
        ];
        const response = await this.repository.aggregate(stages);
        return response;
    }
    save(data) {
        const reference = this.repository.getReference(data.id);
        const group = this.repository.assign(reference, data);
        this.repository.persist(group);
    }
    delete(data) {
        const reference = this.repository.getReference(data.id);
        const group = this.repository.assign(reference, data);
        this.repository.remove(group);
    }
}
exports.default = MikroGroupsRepository;

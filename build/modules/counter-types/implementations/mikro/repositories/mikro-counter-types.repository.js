"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_counter_types_dto_1 = __importDefault(require("../../../contracts/dtos/create-counter-types.dto"));
const find_counter_types_dto_1 = __importDefault(require("../../../contracts/dtos/find-counter-types.dto"));
const counter_type_1 = __importDefault(require("../../../contracts/models/counter-type"));
const couter_types_repository_1 = __importDefault(require("../../../contracts/repositories/couter-types.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const counter_type_mapper_1 = __importDefault(require("../mapper/counter-type.mapper"));
const mikro_counter_type_1 = __importDefault(require("../models/mikro-counter-type"));
class MikroCounterTypesRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_counter_type_1.default);
    }
    create(data) {
        const counterType = new mikro_counter_type_1.default(data);
        this.repository.persist(counterType);
        return counter_type_mapper_1.default.toEntity(counterType);
    }
    async findOne({ id, label, ownerId, }) {
        const counterType = await this.repository.findOne({
            ...(id && { id }),
            ...(label && { label }),
            ...(ownerId && { ownerId }),
        });
        return counterType ? counter_type_mapper_1.default.toEntity(counterType) : undefined;
    }
    async find({ id, label, ownerId, }) {
        const counterTypes = await this.repository.find({
            ...(id && { id }),
            ...(label && { label }),
            ...(ownerId && { ownerId }),
        });
        return counterTypes.map(counterType => counter_type_mapper_1.default.toEntity(counterType));
    }
    save(data) {
        const reference = this.repository.getReference(data.id);
        const counterType = this.repository.assign(reference, data);
        this.repository.persist(counterType);
    }
}
exports.default = MikroCounterTypesRepository;

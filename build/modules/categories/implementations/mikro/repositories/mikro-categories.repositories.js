"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_category_dto_1 = __importDefault(require("../../../contracts/dtos/create-category.dto"));
const find_category_dto_1 = __importDefault(require("../../../contracts/dtos/find-category.dto"));
const category_1 = __importDefault(require("../../../contracts/models/category"));
const categories_repository_1 = __importDefault(require("../../../contracts/repositories/categories.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const mikro_category_mapper_1 = __importDefault(require("../mappers/mikro-category.mapper"));
const mikro_category_1 = __importDefault(require("../model/mikro-category"));
class MikroCategoriesRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_category_1.default);
    }
    create(data) {
        const mikroCategory = new mikro_category_1.default(data);
        this.repository.persist(mikroCategory);
        return mikro_category_mapper_1.default.toEntity(mikroCategory);
    }
    async findOne(data) {
        const category = await this.repository.findOne({
            [data.by]: data.value,
        });
        return category ? mikro_category_mapper_1.default.toEntity(category) : undefined;
    }
    async find(data) {
        const categories = await this.repository.find({
            [data.by]: data.value,
        });
        return categories.map(category => mikro_category_mapper_1.default.toEntity(category));
    }
    save(data) {
        this.repository.persist(mikro_category_mapper_1.default.toMikroEntity(data));
    }
}
exports.default = MikroCategoriesRepository;

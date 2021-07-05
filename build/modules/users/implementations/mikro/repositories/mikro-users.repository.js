"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_user_dto_1 = __importDefault(require("../../../contracts/dtos/create-user.dto"));
const find_user_dto_1 = __importDefault(require("../../../contracts/dtos/find-user.dto"));
const find_users_dto_1 = __importDefault(require("../../../contracts/dtos/find-users.dto"));
const user_1 = __importDefault(require("../../../contracts/models/user"));
const users_repository_1 = __importDefault(require("../../../contracts/repositories/users.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const mikro_user_1 = __importDefault(require("../models/mikro-user"));
const user_mapper_1 = __importDefault(require("../models/user-mapper"));
class MikroUsersRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_user_1.default);
    }
    create(data) {
        const user = new mikro_user_1.default(data);
        this.repository.persist(user);
        return user_mapper_1.default.toApi(user);
    }
    async findOne(data) {
        const user = await this.repository.findOne({
            [data.by]: data.value,
        }, {
            populate: data.populate,
            fields: data.fields,
        });
        return user ? user_mapper_1.default.toApi(user) : undefined;
    }
    async find(data) {
        const query = {};
        if (data.filters.role)
            query.role = data.filters.role;
        if (data.filters.ownerId)
            query.ownerId = data.filters.ownerId;
        if (data.filters.groupIds)
            query.groupIds = {
                $in: data.filters.groupIds,
            };
        const users = await this.repository.find({
            ...query,
        }, {
            limit: data.limit,
            offset: data.offset,
            populate: data.populate,
            fields: data.fields,
        });
        return users.map(user => user_mapper_1.default.toApi(user));
    }
    save(data) {
        const user = user_mapper_1.default.toOrm(data);
        this.repository.persist(user);
    }
    delete(data) {
        const user = user_mapper_1.default.toOrm(data);
        this.repository.remove(user);
    }
}
exports.default = MikroUsersRepository;

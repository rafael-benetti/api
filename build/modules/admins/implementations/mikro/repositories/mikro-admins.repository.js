"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_admin_dto_1 = __importDefault(require("../../../contracts/dtos/create-admin.dto"));
const find_admin_dto_1 = __importDefault(require("../../../contracts/dtos/find-admin.dto"));
const admin_1 = __importDefault(require("../../../contracts/models/admin"));
const admins_repository_1 = __importDefault(require("../../../contracts/repositories/admins.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const admin_mapper_1 = __importDefault(require("../models/admin-mapper"));
const mikro_admin_1 = __importDefault(require("../models/mikro-admin"));
class MikroAdminsRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_admin_1.default);
    }
    create(data) {
        const admin = new mikro_admin_1.default(data);
        this.repository.persist(admin);
        return admin_mapper_1.default.toApi(admin);
    }
    async findOne(data) {
        const owner = await this.repository.findOne({
            [data.by]: data.value,
        });
        return owner ? admin_mapper_1.default.toApi(owner) : undefined;
    }
    save(data) {
        const reference = this.repository.getReference(data.id);
        const admin = this.repository.assign(reference, data);
        this.repository.persist(admin);
    }
    delete(data) {
        const admin = admin_mapper_1.default.toOrm(data);
        this.repository.remove(admin);
    }
}
exports.default = MikroAdminsRepository;

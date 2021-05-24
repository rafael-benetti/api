"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const typeorm_1 = require("typeorm");
const type_company_1 = __importDefault(require("../entities/type-company"));
class TypeCompaniesRepository {
    constructor() {
        this.ormRepository = typeorm_1.getRepository(type_company_1.default);
    }
    async findByOwnerId(ownerId) {
        this.ormRepository = typeorm_1.getRepository(type_company_1.default);
        const companies = await this.ormRepository.find({ where: { ownerId } });
        return companies;
    }
    async find(ownerId) {
        if (ownerId) {
            const companies = await this.ormRepository.find({
                where: ownerId,
            });
            return companies;
        }
        const companies = await this.ormRepository.find();
        return companies;
    }
}
exports.default = TypeCompaniesRepository;

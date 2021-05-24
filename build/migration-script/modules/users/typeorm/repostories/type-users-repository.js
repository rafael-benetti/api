"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const typeorm_1 = require("typeorm");
const type_user_1 = __importDefault(require("../entities/type-user"));
class TypeUsersRepository {
    constructor() {
        this.ormRepository = typeorm_1.getRepository(type_user_1.default);
    }
    async findByOwnerId(ownerId) {
        this.ormRepository = typeorm_1.getRepository(type_user_1.default);
        const users = await this.ormRepository.find({ where: { ownerId } });
        return users;
    }
    async find() {
        const users = await this.ormRepository.find({
            relations: ['companies'],
        });
        return users;
    }
    async findById(id) {
        const user = await this.ormRepository
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.companies', 'companies')
            .where({ id })
            .getOne();
        return user;
    }
    async findByEmail(email) {
        const user = await this.ormRepository.findOne({
            where: { email },
            relations: ['companies'],
        });
        return user;
    }
}
exports.default = TypeUsersRepository;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const typeorm_1 = require("typeorm");
const type_credit_1 = __importDefault(require("../entities/type-credit"));
class TypeCreditsRepository {
    constructor() {
        this.ormRepository = typeorm_1.getRepository(type_credit_1.default);
    }
    async find() {
        const credits = await this.ormRepository.find();
        return credits;
    }
}
exports.default = TypeCreditsRepository;

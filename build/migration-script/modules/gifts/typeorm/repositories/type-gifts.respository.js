"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const typeorm_1 = require("typeorm");
const gift_1 = __importDefault(require("../entities/gift"));
class TypeGiftsRepository {
    constructor() {
        this.ormRepository = typeorm_1.getRepository(gift_1.default);
    }
    async find() {
        const gifts = await this.ormRepository.find();
        return gifts;
    }
}
exports.default = TypeGiftsRepository;

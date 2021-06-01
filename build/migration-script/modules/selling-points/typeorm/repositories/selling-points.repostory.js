"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
const typeorm_1 = require("typeorm");
const type_selling_point_1 = __importDefault(require("../entities/type-selling-point"));
class TypeSellingPointsRepository {
    constructor() {
        this.ormRepository = typeorm_1.getRepository(type_selling_point_1.default);
    }
    async findById(sellingPointId) {
        const sellingPoint = await this.ormRepository.findOne({
            where: { id: sellingPointId },
            relations: ['address'],
        });
        return sellingPoint;
    }
    async find() {
        const sellingPoints = await this.ormRepository.find({
            relations: ['address'],
        });
        return sellingPoints;
    }
}
exports.default = TypeSellingPointsRepository;

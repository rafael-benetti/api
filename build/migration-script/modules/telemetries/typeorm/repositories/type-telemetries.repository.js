"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const typeorm_1 = require("typeorm");
const type_telemetry_1 = __importDefault(require("../entities/type-telemetry"));
class TypeTelemetriesRepository {
    constructor() {
        this.ormRepository = typeorm_1.getRepository(type_telemetry_1.default);
    }
    async findByOwnerId(ownerId) {
        this.ormRepository = typeorm_1.getRepository(type_telemetry_1.default);
        const telemetries = await this.ormRepository.find({ where: { ownerId } });
        return telemetries;
    }
    async find(ownerId) {
        if (ownerId) {
            const telemetries = await this.ormRepository.find({
                where: ownerId,
            });
            return telemetries;
        }
        const telemetries = await this.ormRepository.find();
        return telemetries;
    }
}
exports.default = TypeTelemetriesRepository;

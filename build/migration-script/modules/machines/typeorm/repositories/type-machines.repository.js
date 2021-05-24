"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const typeorm_1 = require("typeorm");
const type_machine_1 = __importDefault(require("../entities/type-machine"));
class TypeMachinesRepository {
    constructor() {
        this.ormRepository = typeorm_1.getRepository(type_machine_1.default);
    }
    async find() {
        const machines = await this.ormRepository.find({
            relations: ['counters'],
        });
        return machines;
    }
    async findOne(telemetryId) {
        const typeMachine = await this.ormRepository.findOne({
            where: {
                telemetryId,
            },
        });
        return typeMachine;
    }
}
exports.default = TypeMachinesRepository;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const typeorm_1 = require("typeorm");
const type_machine_collect_1 = __importDefault(require("../entities/type-machine-collect"));
class TypeMachineCollectRepository {
    constructor() {
        this.ormRepository = typeorm_1.getRepository(type_machine_collect_1.default);
    }
    async find() {
        const machineCollects = await this.ormRepository.find({
            relations: ['counters', 'counters.photos'],
        });
        return machineCollects;
    }
}
exports.default = TypeMachineCollectRepository;

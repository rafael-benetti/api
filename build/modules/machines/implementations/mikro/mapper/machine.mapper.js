"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const machine_1 = __importDefault(require("../../../contracts/models/machine"));
const mikro_machine_1 = __importDefault(require("../models/mikro-machine"));
class MachineMapper {
    static toEntity(data) {
        const machine = new machine_1.default();
        Object.assign(machine, data);
        return machine;
    }
    static toMikroEntity(data) {
        const machine = new mikro_machine_1.default();
        Object.assign(machine, data);
        return machine;
    }
}
exports.default = MachineMapper;

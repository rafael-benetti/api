"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const machine_log_1 = __importDefault(require("../../../contracts/entities/machine-log"));
const mikro_machine_log_1 = __importDefault(require("../entities/mikro-machine-log"));
class MachineLogMapper {
    static toEntity(data) {
        const machineLog = new machine_log_1.default();
        Object.assign(machineLog, data);
        return machineLog;
    }
    static toMikroEntity(data) {
        const machineLog = new mikro_machine_log_1.default();
        Object.assign(machineLog, data);
        return machineLog;
    }
}
exports.default = MachineLogMapper;

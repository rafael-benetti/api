"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("../../../contracts/models/log"));
const mikro_log_1 = __importDefault(require("./mikro-log"));
class LogMapper {
    static toEntity(data) {
        const log = new log_1.default();
        Object.assign(log, data);
        return log;
    }
    static toMikroEntity(data) {
        const log = new mikro_log_1.default();
        Object.assign(log, data);
        return log;
    }
}
exports.default = LogMapper;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telemetry_log_1 = __importDefault(require("../../../contracts/entities/telemetry-log"));
const mikro_telemetry_log_1 = __importDefault(require("../entities/mikro-telemetry-log"));
class TelemetryLogMapper {
    static toApi(data) {
        const telemetryLog = new telemetry_log_1.default();
        Object.assign(telemetryLog, data);
        return telemetryLog;
    }
    static toOrm(data) {
        const telemetryLog = new mikro_telemetry_log_1.default();
        Object.assign(telemetryLog, data);
        return telemetryLog;
    }
}
exports.default = TelemetryLogMapper;

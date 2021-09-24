"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telemetry_board_1 = __importDefault(require("../../../contracts/entities/telemetry-board"));
const mikro_telemetry_board_1 = __importDefault(require("../entities/mikro-telemetry-board"));
class TelemetryBoardMapper {
    static toApi(data) {
        const telemetryBoard = new telemetry_board_1.default();
        Object.assign(telemetryBoard, data);
        return telemetryBoard;
    }
    static toOrm(data) {
        const telemetryBoard = new mikro_telemetry_board_1.default();
        Object.assign(telemetryBoard, data);
        return telemetryBoard;
    }
}
exports.default = TelemetryBoardMapper;

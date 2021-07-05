"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_1 = __importDefault(require("../../../groups/contracts/models/group"));
const create_telemetry_board_dto_1 = __importDefault(require("../dtos/create-telemetry-board.dto"));
class TelemetryBoard {
    constructor(data) {
        if (data) {
            this.ownerId = data.ownerId;
            this.groupId = data.groupId;
            this.integratedCircuitCardId = data.integratedCircuitCardId;
            this.connectionStrength = data.connectionStrength;
            this.connectionType = data.connectionType;
            this.lastConnection = data.lastConnection;
            this.machineId = data.machineId;
        }
    }
}
exports.default = TelemetryBoard;

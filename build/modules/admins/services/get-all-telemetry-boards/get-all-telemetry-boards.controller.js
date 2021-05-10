"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const get_all_telemetry_boards_service_1 = __importDefault(require("./get-all-telemetry-boards.service"));
class GetAllTelemetryBoardsController {
}
GetAllTelemetryBoardsController.handle = async (request, response) => {
    const getTelemetryBoards = tsyringe_1.container.resolve(get_all_telemetry_boards_service_1.default);
    const telemetryBoards = await getTelemetryBoards.execute();
    return response.json(telemetryBoards);
};
exports.default = GetAllTelemetryBoardsController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_telemetry_boards_service_1 = __importDefault(require("./list-telemetry-boards.service"));
class ListTelemetryBoardsController {
}
ListTelemetryBoardsController.handle = async (req, res) => {
    const { userId } = req;
    const { groupId, limit, offset } = req.query;
    const listTelemetryBoards = tsyringe_1.container.resolve(list_telemetry_boards_service_1.default);
    const telemetryBoards = await listTelemetryBoards.execute({
        userId,
        groupId: groupId,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
    });
    return res.json(telemetryBoards);
};
exports.default = ListTelemetryBoardsController;

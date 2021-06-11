"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_telemetry_logs_service_1 = __importDefault(require("./list-telemetry-logs.service"));
class ListTelemetryLogsController {
    static async handle(req, res) {
        const { userId } = req;
        const { machineId, startDate, endDate, type, limit, offset } = req.query;
        const listTelemetryLogsService = tsyringe_1.container.resolve(list_telemetry_logs_service_1.default);
        const telemetryLogs = await listTelemetryLogsService.execute({
            userId,
            machineId: machineId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            type: type,
            limit: Number(limit),
            offset: Number(offset),
        });
        return res.json(telemetryLogs);
    }
}
exports.default = ListTelemetryLogsController;

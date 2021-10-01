"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../../config/logger"));
const log_type_enum_1 = __importDefault(require("../../../logs/contracts/enums/log-type.enum"));
const tsyringe_1 = require("tsyringe");
const list_logs_service_1 = __importDefault(require("./list-logs.service"));
class ListLogsController {
}
ListLogsController.handle = async (req, res) => {
    const { userId } = req;
    const { start_date: startDate, end_date: endDate, type, owner_id: ownerId, limit, offset, } = req.query;
    const listLogs = tsyringe_1.container.resolve(list_logs_service_1.default);
    logger_1.default.info(userId);
    const logs = await listLogs.execute({
        adminId: userId,
        filters: {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            ownerId: ownerId,
            type: type,
        },
        limit: Number(limit),
        offset: Number(offset),
    });
    return res.json(logs);
};
exports.default = ListLogsController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_type_enum_1 = __importDefault(require("../../../logs/contracts/enums/log-type.enum"));
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
const delete_logs_service_1 = __importDefault(require("./delete-logs.service"));
class DeleteLogsController {
}
DeleteLogsController.handle = async (req, res) => {
    const { userId } = req;
    const { start_date: startDate, type, owner_id: ownerId } = req.query;
    const deleteLogsService = tsyringe_1.container.resolve(delete_logs_service_1.default);
    const logs = await deleteLogsService.execute({
        adminId: userId,
        startDate: startDate
            ? new Date(startDate)
            : date_fns_1.subMonths(new Date(), 6),
        ownerId: ownerId,
        type: type,
    });
    return res.json(logs);
};
exports.default = DeleteLogsController;

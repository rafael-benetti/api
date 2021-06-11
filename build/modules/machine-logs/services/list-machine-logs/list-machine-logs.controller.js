"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const machine_log_type_1 = __importDefault(require("../../contracts/enums/machine-log-type"));
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const list_machine_logs_service_1 = __importDefault(require("./list-machine-logs.service"));
class ListMachineLogsController {
    static async handle(req, res) {
        const { userId } = req;
        const { limit, offset, machineId, startDate, endDate, type } = req.query;
        const listMachineLogsService = tsyringe_1.container.resolve(list_machine_logs_service_1.default);
        const machineLogs = await listMachineLogsService.execute({
            userId,
            machineId: machineId,
            type: type,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: Number(limit),
            offset: Number(offset),
        });
        return res.json(machineLogs);
    }
}
ListMachineLogsController.validate = celebrate_1.celebrate({
    query: {
        startDate: celebrate_1.Joi.date(),
        endDate: celebrate_1.Joi.date(),
        limit: celebrate_1.Joi.number(),
        offset: celebrate_1.Joi.number(),
        machineId: celebrate_1.Joi.string().required(),
        type: celebrate_1.Joi.string().valid('REMOTE_CREDIT', 'FIX_STOCK'),
    },
});
exports.default = ListMachineLogsController;

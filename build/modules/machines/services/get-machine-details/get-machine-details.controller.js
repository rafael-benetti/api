"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const period_dto_1 = __importDefault(require("../../contracts/dtos/period.dto"));
const tsyringe_1 = require("tsyringe");
const get_machine_details_service_1 = __importDefault(require("./get-machine-details.service"));
class GetMachineDetailsController {
    static async handle(req, res) {
        const { userId } = req;
        const { machineId } = req.params;
        const { period } = req.query;
        const getMachineDetailsService = tsyringe_1.container.resolve(get_machine_details_service_1.default);
        const response = await getMachineDetailsService.execute({
            machineId,
            userId,
            period: period,
        });
        return res.json(response);
    }
}
exports.default = GetMachineDetailsController;

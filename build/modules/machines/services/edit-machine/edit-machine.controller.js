"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const edit_machine_service_1 = __importDefault(require("./edit-machine.service"));
class EditMachineController {
    static async handle(req, res) {
        const { userId } = req;
        const { machineId } = req.params;
        const { boxes, categoryId, gameValue, groupId, locationId, operatorId, serialNumber, isActive, telemetryBoardId, maintenance, } = req.body;
        const editMachineService = tsyringe_1.container.resolve(edit_machine_service_1.default);
        const machine = await editMachineService.execute({
            boxes,
            categoryId,
            gameValue,
            groupId,
            locationId,
            machineId,
            operatorId,
            serialNumber,
            userId,
            isActive,
            telemetryBoardId,
            maintenance,
        });
        return res.json(machine);
    }
}
exports.default = EditMachineController;

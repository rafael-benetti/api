"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_machine_service_1 = __importDefault(require("./create-machine.service"));
class CreateMachineController {
    static async handle(req, res) {
        const { userId } = req;
        const { boxes, categoryId, gameValue, groupId, locationId, operatorId, serialNumber, telemetryBoardId, } = req.body;
        const createMachineService = tsyringe_1.container.resolve(create_machine_service_1.default);
        const machine = await createMachineService.execute({
            boxes,
            categoryId,
            gameValue,
            groupId,
            locationId,
            operatorId,
            serialNumber,
            userId,
            telemetryBoardId,
        });
        return res.json(machine);
    }
}
exports.default = CreateMachineController;

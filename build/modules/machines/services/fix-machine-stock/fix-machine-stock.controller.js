"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const fix_machine_stock_service_1 = __importDefault(require("./fix-machine-stock.service"));
class FixMachineStockController {
}
FixMachineStockController.validate = celebrate_1.celebrate({
    body: {
        boxId: celebrate_1.Joi.string().required(),
        quantity: celebrate_1.Joi.number().integer().required(),
        observations: celebrate_1.Joi.string().required(),
    },
});
FixMachineStockController.handle = async (request, response) => {
    const { userId } = request;
    const { boxId, quantity, observations } = request.body;
    const { machineId } = request.params;
    const fixMachineStock = tsyringe_1.container.resolve(fix_machine_stock_service_1.default);
    const machine = await fixMachineStock.execute({
        userId,
        machineId,
        boxId,
        quantity,
        observations,
    });
    return response.json(machine);
};
exports.default = FixMachineStockController;

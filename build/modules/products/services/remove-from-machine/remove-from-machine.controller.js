"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const remove_from_machine_service_1 = __importDefault(require("./remove-from-machine.service"));
class RemoveFromMachineController {
}
exports.default = RemoveFromMachineController;
RemoveFromMachineController.validate = celebrate_1.celebrate({
    body: {
        machineId: celebrate_1.Joi.string().uuid().required(),
        boxId: celebrate_1.Joi.string().uuid().required(),
        quantity: celebrate_1.Joi.number().required(),
        toGroup: celebrate_1.Joi.bool().required(),
    },
});
RemoveFromMachineController.handle = async (request, response) => {
    const { userId } = request;
    const { machineId, boxId, quantity, toGroup } = request.body;
    const { productId } = request.params;
    const removeFromMachine = tsyringe_1.container.resolve(remove_from_machine_service_1.default);
    await removeFromMachine.execute({
        userId,
        productId,
        machineId,
        boxId,
        quantity,
        toGroup,
    });
    return response.status(204).send();
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const remote_credit_service_1 = __importDefault(require("./remote-credit.service"));
class RemoteCreditController {
    static async handle(req, res) {
        const { userId } = req;
        const { machineId } = req.params;
        const { observations, quantity } = req.body;
        const remoteCreditService = tsyringe_1.container.resolve(remote_credit_service_1.default);
        await remoteCreditService.execute({
            userId,
            machineId,
            observations,
            quantity,
        });
        return res.status(204).json();
    }
}
RemoteCreditController.validate = celebrate_1.celebrate({
    body: {
        quantity: celebrate_1.Joi.number().required(),
        observations: celebrate_1.Joi.string().required(),
    },
    params: {
        machineId: celebrate_1.Joi.string().uuid().required(),
    },
});
exports.default = RemoteCreditController;

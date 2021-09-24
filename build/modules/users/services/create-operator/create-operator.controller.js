"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_operator_service_1 = __importDefault(require("./create-operator.service"));
class CreateOperatorController {
}
CreateOperatorController.handle = async (req, res) => {
    const { userId } = req;
    const { email, name, groupIds, permissions, phoneNumber } = req.body;
    const createOperator = tsyringe_1.container.resolve(create_operator_service_1.default);
    const operator = await createOperator.execute({
        userId,
        email,
        name,
        groupIds,
        permissions,
        phoneNumber,
    });
    return res.status(201).json(operator);
};
exports.default = CreateOperatorController;

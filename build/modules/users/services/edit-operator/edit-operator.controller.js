"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const edit_operator_service_1 = __importDefault(require("./edit-operator.service"));
class EditOperatorController {
}
EditOperatorController.handle = async (req, res) => {
    const { userId } = req;
    const { operatorId } = req.params;
    const { groupIds, permissions, phoneNumber, isActive } = req.body;
    const editOperator = tsyringe_1.container.resolve(edit_operator_service_1.default);
    const operator = await editOperator.execute({
        userId,
        operatorId,
        groupIds,
        permissions,
        phoneNumber,
        isActive,
    });
    return res.json(operator);
};
exports.default = EditOperatorController;

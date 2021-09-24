"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_operators_service_1 = __importDefault(require("./list-operators.service"));
class ListOperatorsController {
}
ListOperatorsController.handle = async (req, res) => {
    const { userId } = req;
    const { groupId, limit, offset } = req.query;
    const listOperators = tsyringe_1.container.resolve(list_operators_service_1.default);
    const operators = await listOperators.execute({
        userId,
        groupId,
        limit,
        offset,
    });
    return res.json(operators);
};
exports.default = ListOperatorsController;

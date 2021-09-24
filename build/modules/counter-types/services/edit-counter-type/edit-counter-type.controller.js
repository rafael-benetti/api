"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const edit_counter_type_service_1 = __importDefault(require("./edit-counter-type.service"));
class EditCounterTypeController {
    static async handle(req, res) {
        const { userId } = req;
        const { counterTypeId } = req.params;
        const { label } = req.body;
        const editCounterTypeService = tsyringe_1.container.resolve(edit_counter_type_service_1.default);
        const counterType = await editCounterTypeService.execute({
            userId,
            counterTypeId,
            label,
        });
        return res.json(counterType);
    }
}
exports.default = EditCounterTypeController;

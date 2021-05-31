"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_counter_type_service_1 = __importDefault(require("./create-counter-type.service"));
class CreateCounterTypeController {
    static async handle(req, res) {
        const { userId } = req;
        const { label, type } = req.body;
        const createCounterTypeService = tsyringe_1.container.resolve(create_counter_type_service_1.default);
        const counterType = await createCounterTypeService.execute({
            userId,
            label,
            type,
        });
        return res.json(counterType);
    }
}
exports.default = CreateCounterTypeController;

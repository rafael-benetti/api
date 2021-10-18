"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const get_inventory_service_1 = __importDefault(require("./get-inventory.service"));
class GetInvetoryController {
    static async handle(req, res) {
        const { userId } = req;
        const { groupId } = req.query;
        const getInvetoryService = tsyringe_1.container.resolve(get_inventory_service_1.default);
        const response = await getInvetoryService.execute({
            userId,
            groupId: groupId,
        });
        return res.json(response);
    }
}
exports.default = GetInvetoryController;
GetInvetoryController.validate = celebrate_1.celebrate({
    query: {
        groupId: celebrate_1.Joi.string(),
    },
});

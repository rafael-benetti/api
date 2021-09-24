"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const add_to_stock_service_1 = __importDefault(require("./add-to-stock.service"));
class AddToStockController {
}
AddToStockController.handle = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    const { groupId, quantity, type, cost } = req.body;
    const addToStock = tsyringe_1.container.resolve(add_to_stock_service_1.default);
    await addToStock.execute({
        userId,
        groupId,
        productId,
        quantity,
        type,
        cost,
    });
    return res.status(204).send();
};
exports.default = AddToStockController;

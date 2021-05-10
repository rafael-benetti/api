"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_product_service_1 = __importDefault(require("./create-product.service"));
class CreateProductController {
}
CreateProductController.handle = async (req, res) => {
    const { userId } = req;
    const { groupId, label, type, quantity, cost } = req.body;
    const createProduct = tsyringe_1.container.resolve(create_product_service_1.default);
    const product = await createProduct.execute({
        userId,
        groupId,
        label,
        type,
        quantity,
        cost,
    });
    return res.status(201).json(product);
};
exports.default = CreateProductController;

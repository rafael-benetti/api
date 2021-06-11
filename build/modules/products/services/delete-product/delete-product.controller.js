"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const delete_product_service_1 = __importDefault(require("./delete-product.service"));
class DeleteProductController {
}
DeleteProductController.handle = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    const { productType, from } = req.body;
    const deleteProduct = tsyringe_1.container.resolve(delete_product_service_1.default);
    await deleteProduct.execute({
        userId,
        productId,
        productType,
        from,
    });
    return res.status(204).send();
};
exports.default = DeleteProductController;

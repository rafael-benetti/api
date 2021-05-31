"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const transfer_product_service_1 = __importDefault(require("./transfer-product.service"));
class TransferProductController {
}
TransferProductController.handle = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    const { productType, productQuantity, from, to, cost } = req.body;
    const transferProduct = tsyringe_1.container.resolve(transfer_product_service_1.default);
    await transferProduct.execute({
        userId,
        productId,
        productType,
        productQuantity,
        from,
        to,
        cost,
    });
    return res.status(204).send();
};
exports.default = TransferProductController;

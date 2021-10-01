"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const edit_point_of_sale_service_1 = __importDefault(require("./edit-point-of-sale.service"));
class EditPointOfSaleController {
}
EditPointOfSaleController.handle = async (req, res) => {
    const { userId } = req;
    const { pointOfSaleId } = req.params;
    const { label, contactName, primaryPhoneNumber, secondaryPhoneNumber, rent, isPercentage, address, } = req.body;
    const editPointOfSale = tsyringe_1.container.resolve(edit_point_of_sale_service_1.default);
    const pointOfSale = await editPointOfSale.execute({
        userId,
        pointOfSaleId,
        label,
        contactName,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        rent,
        isPercentage,
        address,
    });
    return res.json(pointOfSale);
};
exports.default = EditPointOfSaleController;

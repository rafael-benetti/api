"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_point_of_sale_service_1 = __importDefault(require("./create-point-of-sale.service"));
class CreatePointOfSaleController {
}
CreatePointOfSaleController.handle = async (req, res) => {
    const { userId } = req;
    const { groupId, label, contactName, primaryPhoneNumber, secondaryPhoneNumber, rent, isPercentage, address, } = req.body;
    const createPointOfSale = tsyringe_1.container.resolve(create_point_of_sale_service_1.default);
    const pointOfSale = await createPointOfSale.execute({
        userId,
        groupId,
        label,
        contactName,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        rent,
        isPercentage,
        address,
    });
    return res.status(201).json(pointOfSale);
};
exports.default = CreatePointOfSaleController;

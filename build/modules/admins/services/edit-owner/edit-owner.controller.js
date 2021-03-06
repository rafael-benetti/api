"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const edit_owner_service_1 = __importDefault(require("./edit-owner.service"));
class EditOwnerController {
}
EditOwnerController.handle = async (req, res) => {
    const { userId } = req;
    const { ownerId } = req.params;
    const { name, password, phoneNumber, stateRegistration, document, subscriptionPrice, subscriptionExpirationDate, isActive, } = req.body;
    const editOwnerService = tsyringe_1.container.resolve(edit_owner_service_1.default);
    const owner = await editOwnerService.execute({
        adminId: userId,
        name,
        ownerId,
        password,
        phoneNumber,
        stateRegistration,
        document,
        subscriptionPrice,
        subscriptionExpirationDate,
        isActive,
    });
    return res.json(owner);
};
exports.default = EditOwnerController;

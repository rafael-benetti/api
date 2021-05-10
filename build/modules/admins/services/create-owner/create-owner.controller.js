"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_owner_service_1 = __importDefault(require("./create-owner.service"));
class CreateOwnerController {
}
CreateOwnerController.handle = async (req, res) => {
    const { userId } = req;
    const { email, name } = req.body;
    const createOwner = tsyringe_1.container.resolve(create_owner_service_1.default);
    const owner = await createOwner.execute({
        adminId: userId,
        email,
        name,
    });
    return res.json(owner);
};
exports.default = CreateOwnerController;

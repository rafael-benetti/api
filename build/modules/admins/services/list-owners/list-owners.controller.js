"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_owners_service_1 = __importDefault(require("./list-owners.service"));
class ListOwnersController {
}
ListOwnersController.handle = async (req, res) => {
    const { userId } = req;
    const listOwners = tsyringe_1.container.resolve(list_owners_service_1.default);
    const owners = await listOwners.execute({
        adminId: userId,
    });
    return res.json(owners);
};
exports.default = ListOwnersController;

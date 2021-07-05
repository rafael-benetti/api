"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const edit_manager_service_1 = __importDefault(require("./edit-manager.service"));
class EditManagerController {
}
EditManagerController.handle = async (req, res) => {
    const { userId } = req;
    const { managerId } = req.params;
    const { groupIds, permissions, phoneNumber, isActive } = req.body;
    const editManager = tsyringe_1.container.resolve(edit_manager_service_1.default);
    const manager = await editManager.execute({
        userId,
        managerId,
        groupIds,
        permissions,
        phoneNumber,
        isActive,
    });
    return res.json(manager);
};
exports.default = EditManagerController;

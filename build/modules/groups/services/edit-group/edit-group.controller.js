"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const edit_group_service_1 = __importDefault(require("./edit-group.service"));
class EditGroupController {
}
EditGroupController.handle = async (req, res) => {
    const { userId } = req;
    const { groupId } = req.params;
    const { label } = req.body;
    const editGroup = tsyringe_1.container.resolve(edit_group_service_1.default);
    const group = await editGroup.execute({
        userId,
        groupId,
        label,
    });
    return res.json(group);
};
exports.default = EditGroupController;

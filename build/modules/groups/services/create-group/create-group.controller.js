"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_group_service_1 = __importDefault(require("./create-group.service"));
class CreateGroupController {
}
CreateGroupController.handle = async (req, res) => {
    const { userId } = req;
    const { label } = req.body;
    const createGroup = tsyringe_1.container.resolve(create_group_service_1.default);
    const group = await createGroup.execute({
        userId,
        label,
    });
    return res.status(201).json(group);
};
exports.default = CreateGroupController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_manager_service_1 = __importDefault(require("./create-manager.service"));
class CreateManagerController {
}
CreateManagerController.handle = async (req, res) => {
    const { userId } = req;
    const { email, name, groupIds, permissions } = req.body;
    const createManager = tsyringe_1.container.resolve(create_manager_service_1.default);
    const manager = await createManager.execute({
        userId,
        email,
        name,
        groupIds,
        permissions,
    });
    return res.status(201).json(manager);
};
exports.default = CreateManagerController;

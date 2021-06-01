"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_managers_service_1 = __importDefault(require("./list-managers.service"));
class ListManagersController {
}
ListManagersController.handle = async (req, res) => {
    const { userId } = req;
    const { groupId, limit, offset } = req.query;
    const listManagers = tsyringe_1.container.resolve(list_managers_service_1.default);
    const managers = await listManagers.execute({
        userId,
        groupId,
        limit,
        offset,
    });
    return res.json(managers);
};
exports.default = ListManagersController;

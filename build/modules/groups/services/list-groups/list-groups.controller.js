"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_groups_service_1 = __importDefault(require("./list-groups.service"));
class ListGroupsController {
}
ListGroupsController.handle = async (req, res) => {
    const { userId } = req;
    const { limit, offset } = req.query;
    const listGroups = tsyringe_1.container.resolve(list_groups_service_1.default);
    const groups = await listGroups.execute({
        userId,
        limit,
        offset,
    });
    return res.json(groups);
};
exports.default = ListGroupsController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_notifications_service_1 = __importDefault(require("./list-notifications.service"));
class ListNotificationsController {
    static async handle(req, res) {
        const { userId } = req;
        const { limit, offset } = req.query;
        const listNotificationsService = tsyringe_1.container.resolve(list_notifications_service_1.default);
        const notifications = await listNotificationsService.execute({
            userId,
            limit: Number(limit),
            offset: Number(offset),
        });
        return res.json(notifications);
    }
}
exports.default = ListNotificationsController;

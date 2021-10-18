"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const get_numbers_of_unread_notifications_service_1 = __importDefault(require("./get-numbers-of-unread-notifications.service"));
class GetNumberOfUnreadNotificationsController {
    static async handle(req, res) {
        const { userId } = req;
        const getNumberOfUnreadNotificationsService = tsyringe_1.container.resolve(get_numbers_of_unread_notifications_service_1.default);
        const notificationsCount = await getNumberOfUnreadNotificationsService.execute(userId);
        return res.json(notificationsCount);
    }
}
exports.default = GetNumberOfUnreadNotificationsController;

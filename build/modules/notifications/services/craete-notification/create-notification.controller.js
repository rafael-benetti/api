"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_notification_service_1 = __importDefault(require("./create-notification.service"));
class CreateNotificationController {
    static async handle(req, res) {
        const { title, body, groupId, operatorId, machineId } = req.body;
        const createNotificationService = tsyringe_1.container.resolve(create_notification_service_1.default);
        await createNotificationService.execute({
            title,
            body,
            operatorId,
            machineId,
            groupId,
        });
        return res.status(204).json();
    }
}
exports.default = CreateNotificationController;

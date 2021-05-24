"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_notification_service_1 = __importDefault(require("./create-notification.service"));
class CreateNotificationController {
    static async handle(req, res) {
        const { machineId } = req.params;
        const { title, body, topic, type } = req.body;
        const createNotificationService = tsyringe_1.container.resolve(create_notification_service_1.default);
        await createNotificationService.execute({
            body,
            machineId,
            title,
            topic,
            type,
        });
        return res.status(204).json();
    }
}
exports.default = CreateNotificationController;

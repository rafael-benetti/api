"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mikro_notification_1 = __importDefault(require("../entities/mikro-notification"));
const notification_1 = __importDefault(require("../../../contracts/entities/notification"));
class NotificationMapper {
    static toApi(data) {
        const notification = new notification_1.default();
        Object.assign(notification, data);
        return notification;
    }
    static toOrm(data) {
        const notification = new mikro_notification_1.default();
        Object.assign(notification, data);
        return notification;
    }
}
exports.default = NotificationMapper;
